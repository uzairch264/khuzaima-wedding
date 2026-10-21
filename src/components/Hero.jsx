import React, { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "../lib/gsap";
import { useLang } from "../lib/i18n";
import { describeEvent } from "../lib/invite";
import Chars from "./Chars";
import HeroScene from "./HeroScene";

const enFmt = (o, d) => new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Karachi", ...o }).format(d);

export default function Hero({ opened, events, guest }) {
  const root = useRef(null);
  const { W, t, lang, locale, clock } = useLang();
  const [a, b] = W.couple;
  const announce = events.length === 0;
  const single = events.length === 1 ? W.events[events[0]] : null;

  // date block: "NOVEMBER  7 – 9  2026"
  const starts = events.map((k) => new Date(W.events[k].start)).sort((x, y) => x - y);
  const days = [...new Set(starts.map((d) => +enFmt({ day: "numeric" }, d)))];
  const consecutive = days.every((d, i) => i === 0 || d === days[i - 1] + 1);
  const dayStr = days.length === 1 ? String(days[0]) : consecutive ? `${days[0]} – ${days[days.length - 1]}` : days.join(lang === "ur" ? " اور " : " & ");
  const month = starts.length ? [...new Set(starts.map((d) => new Intl.DateTimeFormat(locale, { timeZone: "Asia/Karachi", month: "long" }).format(d)))].join(" – ") : "";
  const year = starts.length ? enFmt({ year: "numeric" }, starts[0]) : "";

  let timeText = "";
  if (single) {
    const c = clock(single.program[0].time);
    timeText = t("atTime", { time: lang === "ur" ? `${c.ap} ${c.hm}` : `${c.hm} ${c.ap}` });
  }

  useGSAP(() => {
    const text = ".hero-mono, .names .ch, .amp, .name-prefix, .hero-hosts, .date-row, .date-sub, .date-held, .date-venue, .date-time, .hero-events, .hero-city, .hero-line, .hero-sub, .keep, .scroll-pill";
    const scene = ".sky, .clouds, .sea, .garland, .drape, .col, .bunch, .boat, .hero .urn";
    if (!opened) { gsap.set([text, scene], { autoAlpha: 0 }); return; }
    if (reducedMotion()) {
      gsap.set([text, scene], { autoAlpha: 1 });
      gsap.set(".clouds", { autoAlpha: 0.85 });
      return;
    }

    // wait for the gift box to melt away before the scene appears
    const tl = gsap.timeline({ delay: 3.0, defaults: { ease: "power3.out" } });
    tl.fromTo(".sky, .sea", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.6 }, 0)
      .fromTo(".clouds", { autoAlpha: 0 }, { autoAlpha: 0.85, duration: 2.4 }, 0)
      .fromTo(".garland", { y: -70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.8 }, 0.1)
      .fromTo(".drape--l", { xPercent: -25, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 1.7 }, 0.2)
      .fromTo(".drape--r", { xPercent: 25, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 1.7 }, 0.2)
      .fromTo(".col", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.4 }, 0.3)
      .fromTo(".bunch", { scale: 0.75, autoAlpha: 0, transformOrigin: "50% 100%" }, { scale: 1, autoAlpha: 1, duration: 1.4, stagger: 0.1 }, 0.5)
      .fromTo(".hero .urn", { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.4, stagger: 0.15 }, 0.7)
      .fromTo(".boat", { x: 90, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 2.2 }, 0.8)
      .fromTo(".hero-mono", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1.1 }, 1)
      .fromTo(".name:first-child .ch", { autoAlpha: 0, y: 26, rotate: -4 }, { autoAlpha: 1, y: 0, rotate: 0, duration: 1, stagger: 0.05 }, 1.3)
      .fromTo(".amp", { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: "back.out(2)" }, 1.8)
      .fromTo(".name:last-child .ch, .name-prefix", { autoAlpha: 0, y: 26, rotate: 4 }, { autoAlpha: 1, y: 0, rotate: 0, duration: 1, stagger: 0.04 }, 2)
      .fromTo(".hero-hosts, .hero-line, .hero-sub", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.15 }, 2.5)
      .fromTo(".date-row, .date-sub, .date-held, .date-venue, .date-time, .hero-events, .hero-city", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 }, 2.9)
      .fromTo(".keep, .scroll-pill", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.15 }, 3.5);
  }, { scope: root, dependencies: [opened, lang] });

  return (
    <section className="page hero" id="hero" ref={root}>
      <HeroScene />

      <div className="hero-inner">
        <p className="hero-mono">{W.initials}</p>
        {guest && <p className="greeting">{t("dear", { name: guest })}</p>}
        {!announce && (
          <p className="hero-hosts"><span>{W.hosts}</span> {W.hostsLine}</p>
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
          <div className="date-block">
            <div className="date-row">
              <span>{month}</span>
              <b>{dayStr}</b>
              <span dir="ltr">{year}</span>
            </div>
            {single ? (
              <>
                <p className="date-sub">{describeEvent(single, locale).weekday}</p>
                <p className="date-held">{t("toBeHeldAt")}</p>
                <p className="date-venue">{single.venue}</p>
                <p className="date-time">{timeText}</p>
              </>
            ) : (
              <>
                <p className="hero-events">{events.map((k) => W.events[k].title).join("  ·  ")}</p>
                <p className="hero-city">{W.city}</p>
              </>
            )}
          </div>
        )}

        {!announce && <p className="keep">{t("keepScrolling")} <span aria-hidden="true">↓</span></p>}
      </div>

      {!announce && (
        <a className="scroll-pill" href="#together" onClick={(e) => { e.preventDefault(); document.getElementById("together")?.scrollIntoView({ behavior: "smooth" }); }}>
          {t("scrollDown")} <span aria-hidden="true">↓</span>
        </a>
      )}
    </section>
  );
}
