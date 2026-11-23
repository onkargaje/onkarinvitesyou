const KEY = "onkar_shruti_wedding_session";

export const getSessionId = (): string => {
  try {
    const existing = window.localStorage.getItem(KEY);
    if (existing) return existing;
    const id = window.crypto?.randomUUID?.() ?? `guest_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(KEY, id);
    return id;
  } catch {
    return `guest_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }
};