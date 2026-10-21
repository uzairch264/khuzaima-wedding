import React, { useRef } from "react";
import { dateRange } from "../lib/invite";
import { useLang } from "../lib/i18n";
import { gsap, useGSAP, reducedMotion } from "../lib/gsap";
import Urn from "./Urn";

export default function Finale({ events }) {
  const root = useRef(null);
  const { W, t, locale, lang } = useLang();
  const [a, b] = W.couple;
  const announce = events.length === 0;
  const range = dateRange(events.map((k) => W.events[k]), locale);

  useGSAP(() => {
    if (reducedMotion()) return;
    const st = { trigger: root.current, start: "top 70%", once: true };
    gsap.from(".finale-inner > *", { autoAlpha: 0, y: 22, duration: 1.1, stagger: 0.18, ease: "power3.out", scrollTrigger: st });
    gsap.from(".urn", { autoAlpha: 0, y: 60, duration: 1.4, ease: "power3.out", stagger: 0.15, scrollTrigger: st });
  }, { scope: root, dependencies: [lang] });

  return (
    <section className="page finale" ref={root}>
      <div className="finale-inner">
        <p className="monogram">{W.initials}</p>
        <h2 className="finale-names">
          {a.name}
          <span> {W.connector} </span>
          {b.prefix ? `${b.prefix} ` : ""}{b.name}
        </h2>
        {!announce && <p className="finale-meta">{range} · {W.city}</p>}
        <p className="finale-line">{t("finaleLine")}</p>
      </div>
      <Urn className="urn--l" />
      <Urn className="urn--r" />
    </section>
  );
}
