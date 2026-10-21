import React from "react";
import { useLang } from "../lib/i18n";
import MusicButton from "./MusicButton";

/** Fixed top-right controls: language switch + music mute/unmute. */
export default function TopBar({ opened }) {
  const { lang, setLang, t } = useLang();
  return (
    <div className="topbar">
      <button className="pill-btn lang" onClick={() => setLang(lang === "ur" ? "en" : "ur")} aria-label={lang === "ur" ? "Switch to English" : "اردو میں دیکھیں"}>
        {t("langBtn")}
      </button>
      <MusicButton start={opened} />
    </div>
  );
}
