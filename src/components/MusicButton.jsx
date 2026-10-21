import React, { useEffect, useRef, useState } from "react";
import WEDDING from "../config";
import { gsap } from "../lib/gsap";
import { createAmbient } from "../lib/ambient";
import { useLang } from "../lib/i18n";

const FILE_LEVEL = 0.45;

/**
 * Starts when the gift is opened (that tap is the user gesture browsers require).
 * Plays public/assets/music.mp3 if it exists, otherwise a soft generated piece.
 */
export default function MusicButton({ start }) {
  const { t } = useLang();
  const engine = useRef(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!start) return undefined;
    let cancelled = false;
    (async () => {
      let hasFile = false;
      if (WEDDING.music) {
        try {
          const r = await fetch(WEDDING.music, { method: "HEAD" });
          hasFile = r.ok && /audio|mpeg|ogg/.test(r.headers.get("content-type") || "");
        } catch { /* fall back to generated music */ }
      }
      if (cancelled) return;
      if (hasFile) {
        const a = new Audio(WEDDING.music);
        a.loop = true;
        a.volume = 0;
        await a.play().catch(() => {});
        gsap.to(a, { volume: FILE_LEVEL, duration: 3 });
        engine.current = {
          setMuted: (m) => {
            if (!m) a.play().catch(() => {});
            gsap.to(a, { volume: m ? 0 : FILE_LEVEL, duration: 0.5, onComplete: () => { if (m) a.pause(); } });
          },
          stop: () => a.pause(),
        };
      } else {
        const amb = createAmbient();
        await amb.start().catch(() => {});
        engine.current = { setMuted: (m) => amb.setMuted(m), stop: () => amb.stop() };
      }
    })();
    return () => { cancelled = true; engine.current?.stop(); engine.current = null; };
  }, [start]);

  if (!start) return null;

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    engine.current?.setMuted(next);
  };

  return (
    <button className={`pill-btn music${muted ? "" : " is-playing"}`} onClick={toggle} aria-pressed={!muted} aria-label={muted ? t("unmute") : t("mute")} title={muted ? t("unmute") : t("mute")}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 9.5v5h3.6L12 18.5v-13L7.6 9.5H4Z" fill="currentColor" stroke="none" />
        {muted ? (
          <path d="m16 9.5 5 5m0-5-5 5" />
        ) : (
          <>
            <path className="w1" d="M15.2 9.2a4 4 0 0 1 0 5.6" />
            <path className="w2" d="M17.8 6.8a7.5 7.5 0 0 1 0 10.4" />
          </>
        )}
      </svg>
    </button>
  );
}
