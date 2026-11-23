export interface BlessingLike {
  id: string;
  created_at: string;
  like_count: number;
}

export const EDIT_WINDOW_MS = 10 * 60 * 1000;

export const canEditBlessing = (
  blessing: { session_id: string | null; created_at: string },
  sessionId: string | null,
  now: number,
) => {
  const age = now - Date.parse(blessing.created_at);
  return Boolean(sessionId) && blessing.session_id === sessionId && age >= 0 && age < EDIT_WINDOW_MS;
};

export const sortBlessings = <T extends BlessingLike>(
  blessings: T[],
  liveCounts: Record<string, number>,
) =>
  [...blessings].sort((a, b) => {
    const aCount = liveCounts[a.id] ?? a.like_count;
    const bCount = liveCounts[b.id] ?? b.like_count;
    if (bCount !== aCount) return bCount - aCount;
    return b.created_at.localeCompare(a.created_at);
  });

export const isTopBlessing = (index: number) => index >= 0 && index < 3;