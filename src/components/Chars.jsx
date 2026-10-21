import React from "react";
import { useLang } from "../lib/i18n";

/** Per-letter spans (class "ch") for GSAP. Words never break mid-word; Urdu animates whole words so letters stay joined. */
export default function Chars({ text }) {
  const { lang } = useLang();
  const words = text.split(" ");
  return (
    <span aria-label={text}>
      {words.map((word, w) => (
        <React.Fragment key={w}>
          {lang === "ur" ? (
            <span className="word ch" aria-hidden="true">{word}</span>
          ) : (
            <span className="word" aria-hidden="true">
              {[...word].map((c, i) => <span className="ch" key={i}>{c}</span>)}
            </span>
          )}
          {w < words.length - 1 && " "}
        </React.Fragment>
      ))}
    </span>
  );
}
