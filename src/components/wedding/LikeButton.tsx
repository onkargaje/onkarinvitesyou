import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/lib/session";
import { toast } from "sonner";

type Kind = "blessing" | "photo";

const getPhotoBaseLikes = (photoId: string) => {
  let hash = 0;
  for (let index = 0; index < photoId.length; index += 1) {
    hash = (hash * 31 + photoId.charCodeAt(index)) | 0;
  }
  return 40 + (Math.abs(hash) % 11);
};

interface LikeButtonProps {
  kind: Kind;
  itemId: string;
  onChange?: (itemId: string, count: number, liked: boolean) => void;
  size?: "sm" | "md";
  variant?: "card" | "overlay";
}

export const LikeButton = ({
  kind,
  itemId,
  onChange,
  size = "sm",
  variant = "card",
}: LikeButtonProps) => {
  const baseCount = kind === "photo" ? getPhotoBaseLikes(itemId) : 0;
  const [count, setCount] = useState(baseCount);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pulse, setPulse] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => setSessionId(getSessionId()), []);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    setLoading(true);
    const load = async () => {
      try {
        let liveCount = 0;
        let isLiked = false;

        if (kind === "blessing") {
          const [total, own] = await Promise.all([
            supabase
              .from("blessing_likes")
              .select("id", { count: "exact", head: true })
              .eq("blessing_id", itemId),
            supabase
              .from("blessing_likes")
              .select("id")
              .eq("blessing_id", itemId)
              .eq("session_id", sessionId)
              .maybeSingle(),
          ]);
          if (total.error || own.error) throw total.error ?? own.error;
          liveCount = total.count ?? 0;
          isLiked = Boolean(own.data);
        } else {
          const [total, own] = await Promise.all([
            supabase
              .from("photo_likes")
              .select("id", { count: "exact", head: true })
              .eq("photo_id", itemId),
            supabase
              .from("photo_likes")
              .select("id")
              .eq("photo_id", itemId)
              .eq("session_id", sessionId)
              .maybeSingle(),
          ]);
          if (total.error || own.error) throw total.error ?? own.error;
          liveCount = total.count ?? 0;
          isLiked = Boolean(own.data);
        }

        if (cancelled) return;
        const nextCount = baseCount + liveCount;
        setCount(nextCount);
        setLiked(isLiked);
        onChange?.(itemId, nextCount, isLiked);
      } catch {
        if (cancelled) return;
        setCount(baseCount);
        setLiked(false);
        onChange?.(itemId, baseCount, false);
        toast.error("Like counts are unavailable right now.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [baseCount, itemId, kind, onChange, sessionId]);

  const toggle = async () => {
    if (busy || !sessionId) return;
    setBusy(true);
    const previousLiked = liked;
    const previousCount = count;
    const next = !previousLiked;
    const nextCount = Math.max(0, previousCount + (next ? 1 : -1));
    setLiked(next);
    setCount(nextCount);
    setPulse((value) => value + 1);
    onChange?.(itemId, nextCount, next);

    let persisted = false;
    try {
      if (kind === "blessing") {
        if (next) {
          const { error } = await supabase.from("blessing_likes").upsert(
            { blessing_id: itemId, session_id: sessionId },
            { onConflict: "blessing_id,session_id", ignoreDuplicates: true },
          );
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("blessing_likes")
            .delete()
            .eq("blessing_id", itemId)
            .eq("session_id", sessionId);
          if (error) throw error;
        }
        persisted = true;
        const { count: liveCount, error } = await supabase
          .from("blessing_likes")
          .select("id", { count: "exact", head: true })
          .eq("blessing_id", itemId);
        if (error) throw error;
        const exactCount = liveCount ?? 0;
        setCount(exactCount);
        onChange?.(itemId, exactCount, next);
      } else {
        if (next) {
          const { error } = await supabase.from("photo_likes").upsert(
            { photo_id: itemId, session_id: sessionId },
            { onConflict: "photo_id,session_id", ignoreDuplicates: true },
          );
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("photo_likes")
            .delete()
            .eq("photo_id", itemId)
            .eq("session_id", sessionId);
          if (error) throw error;
        }
        persisted = true;
        const { count: liveCount, error } = await supabase
          .from("photo_likes")
          .select("id", { count: "exact", head: true })
          .eq("photo_id", itemId);
        if (error) throw error;
        const exactCount = baseCount + (liveCount ?? 0);
        setCount(exactCount);
        onChange?.(itemId, exactCount, next);
      }
    } catch {
      if (!persisted) {
        setLiked(previousLiked);
        setCount(previousCount);
        onChange?.(itemId, previousCount, previousLiked);
      }
      toast.error(
        persisted
          ? "Your like was saved, but its count could not be refreshed."
          : "Your like couldn’t be saved. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const isOverlay = variant === "overlay";
  const iconSize = size === "md" ? 20 : 16;

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={(event) => {
        event.stopPropagation();
        void toggle();
      }}
      aria-pressed={liked}
      aria-label={loading ? "Loading likes" : liked ? "Unlike" : "Like"}
      aria-busy={loading || busy}
      disabled={!sessionId || loading || busy}
      className={
        isOverlay
          ? "h-auto rounded-full bg-ink/35 px-3 py-1.5 text-ivory backdrop-blur-md hover:bg-ink/50"
          : "h-auto gap-1.5 px-1 py-1 text-rose hover:text-rose/80"
      }
    >
      <span className="relative inline-flex">
        <AnimatePresence>
          {liked && (
            <motion.span
              key={`pulse-${pulse}`}
              initial={{ scale: 0.6, opacity: 0.6 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-rose/40 blur-sm"
            />
          )}
        </AnimatePresence>
        <motion.span
          key={liked ? "on" : "off"}
          initial={{ scale: 0.7 }}
          animate={{ scale: liked ? [1, 1.35, 1] : 1 }}
          transition={{ duration: 0.35 }}
          className="relative"
        >
          <Heart
            size={iconSize}
            className={liked ? "fill-rose text-rose" : isOverlay ? "text-ivory" : "text-rose/70"}
          />
        </motion.span>
      </span>
      <span className={`text-xs font-medium tabular-nums ${isOverlay ? "text-ivory" : ""}`}>
        {count}
      </span>
    </Button>
  );
};
