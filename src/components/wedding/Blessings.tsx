import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { z } from "zod";
import { Crown, Pencil, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { canEditBlessing, EDIT_WINDOW_MS, isTopBlessing, sortBlessings } from "@/lib/blessings";
import { getSessionId } from "@/lib/session";
import { toast } from "sonner";
import { LikeButton } from "./LikeButton";
import { Reveal, SectionTitle } from "./Reveal";

interface Blessing {
  id: string;
  name: string;
  message: string;
  like_count: number;
  created_at: string;
  session_id: string | null;
}

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(80, "Name too long"),
  message: z.string().trim().min(1, "Please write a message").max(1000, "Message too long"),
});

export const Blessings = () => {
  const [list, setList] = useState<Blessing[]>([]);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [now, setNow] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setSessionId(getSessionId());
    const updateNow = () => setNow(Date.now());
    updateNow();
    const timer = window.setInterval(updateNow, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("blessings")
          .select("id, name, message, like_count, created_at, session_id")
          .order("created_at", { ascending: false })
          .limit(100);
        if (cancelled) return;
        if (error) throw error;
        if (cancelled) return;
        const blessings = data ?? [];
        setList(blessings);

        if (blessings.length > 0) {
          const { data: likes, error: likesError } = await supabase
            .from("blessing_likes")
            .select("blessing_id")
            .in(
              "blessing_id",
              blessings.map((blessing) => blessing.id),
            );
          if (cancelled) return;
          if (likesError) {
            toast.error("Blessing likes are unavailable right now.");
          } else {
            const counts = (likes ?? []).reduce<Record<string, number>>((result, like) => {
              result[like.blessing_id] = (result[like.blessing_id] ?? 0) + 1;
              return result;
            }, {});
            setLikeCounts(counts);
          }
        }
      } catch {
        if (!cancelled) {
          setLoadError(true);
          toast.error("Wishes couldn’t be loaded. Please try again later.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = useMemo(() => sortBlessings(list, likeCounts), [list, likeCounts]);
  const onLikeCountChange = useCallback((itemId: string, count: number) => {
    setLikeCounts((previous) => ({ ...previous, [itemId]: count }));
  }, []);

  const startSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = schema.safeParse({ name, message });
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      if (issue) toast.error(issue.message);
      return;
    }
    setConfirmOpen(true);
  };

  const doSubmit = async () => {
    const parsed = schema.safeParse({ name, message });
    if (!parsed.success || !sessionId || submitting) return;
    setSubmitting(true);

    try {
      if (editingId) {
        const { data, error } = await supabase.rpc("update_own_blessing", {
          _id: editingId,
          _name: parsed.data.name,
          _message: parsed.data.message,
          _session_id: sessionId,
        });
        const updated = data?.[0];
        if (error || !updated) {
          toast.error("Could not update. The edit window may have expired.");
          return;
        }
        setList((items) =>
          items.map((item) => (item.id === editingId ? { ...item, ...updated } : item)),
        );
        setEditingId(null);
        setSuccess("Your blessing has been updated");
      } else {
        const { data, error } = await supabase
          .from("blessings")
          .insert({ name: parsed.data.name, message: parsed.data.message, session_id: sessionId })
          .select("id, name, message, like_count, created_at, session_id")
          .single();
        if (error || !data) {
          toast.error("Could not send blessing. Please try again.");
          return;
        }
        setList((items) => [{ ...data, like_count: data.like_count ?? 0 }, ...items]);
        setSuccess("Your blessing has been saved ❤️");
      }
      setName("");
      setMessage("");
      window.setTimeout(() => setSuccess(null), 2800);
      setConfirmOpen(false);
    } catch {
      toast.error("Could not save your blessing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const beginEdit = (blessing: Blessing) => {
    if (!canEditBlessing(blessing, sessionId, now)) return;
    setEditingId(blessing.id);
    setName(blessing.name);
    setMessage(blessing.message);
    document
      .getElementById("blessing-form")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setMessage("");
  };

  return (
    <section className="px-6 py-16 md:py-24">
      <div className="container mx-auto max-w-5xl">
        <Reveal>
          <SectionTitle
            eyebrow="Send Love"
            title="Blessings & Wishes"
            subtitle="Leave a little note for us — it would mean the world."
          />
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-5">
          <Reveal delay={0.1} className="lg:col-span-2">
            <form
              id="blessing-form"
              onSubmit={startSubmit}
              className="glass bg-grain space-y-4 rounded-3xl p-8"
            >
              {editingId && (
                <div className="flex items-center justify-between text-xs text-rose">
                  <span className="inline-flex items-center gap-1.5">
                    <Pencil className="h-3.5 w-3.5" /> Editing your blessing
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={cancelEdit}
                    className="h-auto px-2 py-1 text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </Button>
                </div>
              )}
              <div>
                <label
                  htmlFor="guest-name"
                  className="mb-2 block text-xs uppercase tracking-[0.3em] text-muted-foreground"
                >
                  Your Name
                </label>
                <input
                  id="guest-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={80}
                  className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 font-serif text-lg focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label
                  htmlFor="guest-message"
                  className="mb-2 block text-xs uppercase tracking-[0.3em] text-muted-foreground"
                >
                  Your Message
                </label>
                <textarea
                  id="guest-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={5}
                  maxLength={1000}
                  className="w-full resize-none rounded-xl border border-border bg-background/60 px-4 py-3 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  placeholder="Write your blessings..."
                />
              </div>
              <Button
                type="submit"
                disabled={submitting || !sessionId}
                className="group h-auto w-full rounded-full bg-gradient-to-r from-rose to-rose/90 py-3.5 text-primary-foreground transition-all duration-500 hover:shadow-lg"
              >
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                {submitting ? "Sending..." : editingId ? "Update Blessing" : "Send Blessing"}
              </Button>
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2 text-sm text-sage-deep"
                  >
                    <Sparkles className="h-4 w-4" /> {success}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Reveal>

          <Reveal delay={0.2} className="lg:col-span-3">
            {loading ? (
              <div className="py-10 text-center text-muted-foreground">Loading wishes…</div>
            ) : loadError ? (
              <div className="py-10 text-center text-muted-foreground">
                Wishes are unavailable right now.
              </div>
            ) : sorted.length === 0 ? (
              <div className="py-10 text-center italic text-muted-foreground">
                No blessings yet — be the first to leave one ✨
              </div>
            ) : (
              <div className="scrollbar-hide grid max-h-[560px] gap-4 overflow-y-auto pr-2 sm:grid-cols-2">
                <AnimatePresence initial={false}>
                  {sorted.map((blessing, index) => {
                    const isTop = isTopBlessing(index);
                    const editable = canEditBlessing(blessing, sessionId, now);
                    const minutesLeft = Math.ceil(
                      Math.max(0, EDIT_WINDOW_MS - (now - Date.parse(blessing.created_at))) / 60000,
                    );
                    return (
                      <motion.div
                        key={blessing.id}
                        layout
                        initial={{ opacity: 0, y: 15, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          duration: 0.45,
                          layout: { duration: 0.5, type: "spring", bounce: 0.15 },
                        }}
                        className={`glass bg-grain relative rounded-2xl p-5 ${isTop ? "ring-1 ring-rose/30 shadow-soft" : ""}`}
                      >
                        {isTop && (
                          <div className="absolute -top-2.5 left-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose to-rose/80 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-primary-foreground shadow-md">
                            <Crown className="h-3 w-3" /> Most Loved
                          </div>
                        )}
                        <div className="absolute right-4 top-4">
                          <LikeButton
                            kind="blessing"
                            itemId={blessing.id}
                            onChange={onLikeCountChange}
                          />
                        </div>
                        <p className="whitespace-pre-line pr-14 text-sm italic leading-relaxed text-foreground/90">
                          &ldquo;{blessing.message}&rdquo;
                        </p>
                        <div className="mt-3 flex items-end justify-between gap-2">
                          <p className="font-script text-xl text-rose">- {blessing.name}</p>
                          {editable && (
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => beginEdit(blessing)}
                              title={`You can edit for ${minutesLeft} more min`}
                              className="h-auto gap-1 px-1 py-1 text-[11px] text-muted-foreground hover:text-rose"
                            >
                              <Pencil className="h-3 w-3" /> Edit ({minutesLeft}m)
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </Reveal>
        </div>
      </div>

      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-ink/50 backdrop-blur-md"
              onClick={() => !submitting && setConfirmOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="glass relative w-full max-w-md rounded-3xl bg-background/95 p-8 shadow-2xl"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => !submitting && setConfirmOpen(false)}
                className="absolute right-3 top-3 rounded-full"
                aria-label="Close confirmation"
              >
                <X className="h-4 w-4" />
              </Button>
              <h3 className="mb-2 font-serif text-2xl text-foreground">
                {editingId ? "Update your blessing?" : "Send this blessing?"}
              </h3>
              <p className="mb-5 text-sm text-muted-foreground">
                Are you sure you want to {editingId ? "update" : "submit"} this blessing?
              </p>
              <div className="mb-5 max-h-40 overflow-y-auto rounded-xl border border-border bg-background/60 p-4">
                <p className="whitespace-pre-line text-sm italic text-foreground/90">
                  &ldquo;{message}&rdquo;
                </p>
                <p className="mt-2 font-script text-lg text-rose">- {name}</p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setConfirmOpen(false)}
                  disabled={submitting}
                  className="h-auto flex-1 rounded-full py-2.5"
                >
                  <Pencil className="h-4 w-4" /> Edit
                </Button>
                <Button
                  type="button"
                  onClick={() => void doSubmit()}
                  disabled={submitting}
                  className="h-auto flex-1 rounded-full bg-gradient-to-r from-rose to-rose/90 py-2.5 text-primary-foreground"
                >
                  {submitting ? "Sending..." : "Confirm"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
