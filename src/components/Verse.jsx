import React, { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "../lib/gsap";
import { useLang } from "../lib/i18n";

export default function Verse({ events }) {
  const root = useRef(null);
  const { W, t, num } = useLang();
  const [a, b] = W.couple;
  const n = events.length;
  const line = n === 1
    ? t("homesOne", { title: W.events[events[0]].title })
    : t("homesMany", { n: num(n) });

  useGSAP(() => {
    if (reducedMotion()) return;
    gsap.from(root.current.children, {
      autoAlpha: 0, y: 24, duration: 1.1, stagger: 0.16, ease: "power3.out",
      scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
    });
  }, { scope: root });

  return (
    <section className="page verse" id="together" ref={root}>
      <p className="kicker">{t("inTheName")}</p>
      <p className="bismillah" lang="ar">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
      <p className="verse-en">{t("verse")}</p>
      <p className="verse-ref">{t("verseRef")}</p>
      <span className="rule" aria-hidden="true" />
      <p className="verse-line">{line}</p>
      <div className="families">
        <div><b>{a.family}</b><small>{t("family")}</small></div>
        <i aria-hidden="true" />
        <div><b>{b.family}</b><small>{t("family")}</small></div>
      </div>
    </section>
  );
}
