import React, { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "../lib/gsap";
import { useLang } from "../lib/i18n";
import Chars from "./Chars";
import Flowers from "./Flowers";

export default function Hero({ opened, events, guest }) {
  const root = useRef(null);
  const { W, t, lang } = useLang();
  const [a, b] = W.couple;
  const announce = events.length === 0;

  useGSAP(() => {
    const items = ".kicker, .bismillah, .greeting, .hero-hosts, .amp, .name-prefix, .hero-line, .hero-events, .hero-sub, .scroll-pill, .names .ch, .flowers";
    if (!opened) { gsap.set(items, { autoAlpha: 0 }); return; }
    if (reducedMotion()) { gsap.set(items, { autoAlpha: 1 }); return; }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".flowers", { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 2, transformOrigin: "0% 0%" }, 0)
      .fromTo(".kicker, .bismillah, .greeting, .hero-hosts", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.18 }, 0.3)
      .fromTo(".name:first-child .ch", { autoAlpha: 0, y: 30, rotate: -4 }, { autoAlpha: 1, y: 0, rotate: 0, duration: 1, stagger: 0.06 }, 1)
      .fromTo(".amp", { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.9, ease: "back.out(2)" }, 1.5)
      .fromTo(".name-prefix", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 1.7)
      .fromTo(".name:last-child .ch", { autoAlpha: 0, y: 30, rotate: 4 }, { autoAlpha: 1, y: 0, rotate: 0, duration: 1, stagger: 0.06 }, 1.7)
      .fromTo(".hero-line, .hero-events, .hero-sub", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.18 }, 2.4)
      .fromTo(".scroll-pill", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 3.1);
  }, { scope: root, dependencies: [opened, lang] });

  return (
    <section className="page hero" id="hero" ref={root}>
      <Flowers className="flowers--tl" />
      <Flowers className="flowers--tr hero-flowers-r" />
      <div className="hero-inner">
        <p className="kicker">{announce ? t("bigNewsKicker") : t("theInvitation")}</p>
        <p className="bismillah" lang="ar">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
        {guest && <p className="greeting">{t("dear", { name: guest })}</p>}
        {!announce && (
          <p className="hero-hosts"><b>{W.hosts}</b><br />{W.hostsLine}</p>
        )}
        <h1 className="names">
          <span className="name"><Chars text={a.name} /></span>
          <span className="amp">{W.connector}</span>
          <span className="name">
            {b.prefix && <small className="name-prefix">{b.prefix}</small>}
            <Chars text={b.name} />
          </span>
        </h1>
        {announce ? (
          <>
            <p className="hero-line">{W.announcementLine}</p>
            <p className="hero-sub">{W.announcementSub}</p>
          </>
        ) : (
          <>
            <p className="hero-line">{t("daughterOfJoin")}</p>
            <p className="hero-events">{events.map((k) => W.events[k].title).join("  ·  ")}</p>
          </>
        )}
      </div>
      {!announce && (
        <a className="scroll-pill" href="#together" onClick={(e) => { e.preventDefault(); document.getElementById("together")?.scrollIntoView({ behavior: "smooth" }); }}>
          {t("scrollDown")} <span aria-hidden="true">↓</span>
        </a>
      )}
    </section>
  );
}
