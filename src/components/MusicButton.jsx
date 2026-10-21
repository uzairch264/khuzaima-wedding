import React, { useState } from "react";
import { setMusicMuted } from "../lib/music";
import { useLang } from "../lib/i18n";

/** Mute / unmute control. The music itself is started by the gift-box tap (see lib/music.js). */
export default function MusicButton({ start }) {
  const { t } = useLang();
  const [muted, setMuted] = useState(false);

  if (!start) return null;

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setMusicMuted(next);
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
