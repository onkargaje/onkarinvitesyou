CREATE TABLE public.blessings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  message text NOT NULL,
  like_count integer NOT NULL DEFAULT 0,
  session_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.blessings TO anon, authenticated;
GRANT ALL ON public.blessings TO service_role;
ALTER TABLE public.blessings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read blessings" ON public.blessings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Visitors can submit valid blessings" ON public.blessings FOR INSERT TO anon, authenticated WITH CHECK (
  char_length(trim(name)) BETWEEN 1 AND 80
  AND char_length(trim(message)) BETWEEN 1 AND 1000
  AND char_length(trim(session_id)) BETWEEN 8 AND 64
);
CREATE INDEX idx_blessings_created_at ON public.blessings (created_at DESC);

CREATE TABLE public.blessing_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blessing_id uuid NOT NULL REFERENCES public.blessings(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (blessing_id, session_id)
);
GRANT SELECT, INSERT, DELETE ON public.blessing_likes TO anon, authenticated;
GRANT ALL ON public.blessing_likes TO service_role;
ALTER TABLE public.blessing_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read blessing likes" ON public.blessing_likes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Visitors can like blessings" ON public.blessing_likes FOR INSERT TO anon, authenticated WITH CHECK (
  char_length(trim(session_id)) BETWEEN 8 AND 64
);
CREATE POLICY "Visitors can remove a blessing like" ON public.blessing_likes FOR DELETE TO anon, authenticated USING (true);
CREATE INDEX idx_blessing_likes_blessing ON public.blessing_likes (blessing_id);

CREATE TABLE public.photo_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id text NOT NULL,
  session_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (photo_id, session_id)
);
GRANT SELECT, INSERT, DELETE ON public.photo_likes TO anon, authenticated;
GRANT ALL ON public.photo_likes TO service_role;
ALTER TABLE public.photo_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read photo likes" ON public.photo_likes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Visitors can like photos" ON public.photo_likes FOR INSERT TO anon, authenticated WITH CHECK (
  char_length(trim(photo_id)) BETWEEN 1 AND 128
  AND char_length(trim(session_id)) BETWEEN 8 AND 64
);
CREATE POLICY "Visitors can remove a photo like" ON public.photo_likes FOR DELETE TO anon, authenticated USING (true);
CREATE INDEX idx_photo_likes_photo ON public.photo_likes (photo_id);

CREATE OR REPLACE FUNCTION public.update_own_blessing(_id uuid, _name text, _message text, _session_id text)
RETURNS SETOF public.blessings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF char_length(trim(_name)) NOT BETWEEN 1 AND 80 OR char_length(trim(_message)) NOT BETWEEN 1 AND 1000 THEN
    RAISE EXCEPTION 'Please enter a valid name and message';
  END IF;
  RETURN QUERY
    UPDATE public.blessings AS b
    SET name = trim(_name), message = trim(_message)
    WHERE b.id = _id
      AND b.session_id = _session_id
      AND b.created_at >= now() - interval '10 minutes'
    RETURNING b.*;
END;
$$;
REVOKE ALL ON FUNCTION public.update_own_blessing(uuid, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_own_blessing(uuid, text, text, text) TO anon, authenticated;