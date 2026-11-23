import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export const MusicPlayer = ({ active }: { active: boolean }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.25;
    if (active) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }, [active]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!playing) {
      audio.play().then(() => {
        setPlaying(true);
        audio.muted = false;
        setMuted(false);
      }).catch(() => undefined);
      return;
    }
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  const isOn = playing && !muted;

  return (
    <>
      <audio ref={audioRef} src="/bg-music.mp4" loop preload="none" />
      <div className="pointer-events-none fixed right-4 top-4 z-[80]">
        <div className="relative">
          {isOn && (
            <div className="pointer-events-none absolute -top-2 left-1/2 h-16 w-16 -translate-x-1/2 overflow-visible">
              <span className="music-note music-note-1">♪</span>
              <span className="music-note music-note-2">♫</span>
              <span className="music-note music-note-3">♩</span>
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label={muted ? "Unmute music" : "Mute music"}
            className={`pointer-events-auto h-14 w-14 rounded-full glass shadow-lg transition-transform duration-300 hover:scale-110 ${isOn ? "animate-pulse-soft" : ""}`}
          >
            <Gramophone spinning={isOn} />
          </Button>
        </div>
      </div>
    </>
  );
};

const Gramophone = ({ spinning }: { spinning: boolean }) => (
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" aria-hidden="true">
    <path d="M40 6 C 56 14, 60 24, 56 32 L 38 24 C 36 18, 36 12, 40 6 Z" fill="var(--gold-deep)" stroke="var(--rose)" strokeWidth="1.2" />
    <ellipse cx="48" cy="19" rx="3" ry="6" fill="var(--rose)" opacity="0.5" />
    <path d="M40 24 L 32 36" stroke="var(--gold-deep)" strokeWidth="2.2" strokeLinecap="round" />
    <rect x="14" y="40" width="36" height="12" rx="3" fill="var(--rose)" />
    <rect x="12" y="50" width="40" height="4" rx="2" fill="var(--gold-deep)" />
    <g style={{ transformOrigin: "32px 46px", animation: spinning ? "spin 3s linear infinite" : "none" }}>
      <circle cx="32" cy="46" r="6" fill="var(--foreground)" opacity="0.85" />
      <circle cx="32" cy="46" r="1.2" fill="var(--gold)" />
    </g>
  </svg>
);