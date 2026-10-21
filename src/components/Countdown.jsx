import React, { useEffect, useRef, useState } from "react";
import { useLang } from "../lib/i18n";
import { gsap, useGSAP, reducedMotion } from "../lib/gsap";

const pad = (n) => String(n).padStart(2, "0");

function Num({ value }) {
  const ref = useRef(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (reducedMotion()) return;
    gsap.fromTo(ref.current, { rotationX: -85, autoAlpha: 0 }, { rotationX: 0, autoAlpha: 1, duration: 0.45, ease: "back.out(1.6)" });
  }, [value]);
  return <span className="cd-num" ref={ref}>{value}</span>;
}

export default function Countdown({ events }) {
  const root = useRef(null);
  const { W, t } = useLang();
  const [now, setNow] = useState(() => Date.now());

  // target = earliest invited event that hasn't started yet
  const upcoming = events
    .map((k) => W.events[k])
    .filter((e) => new Date(e.start).getTime() > now)
    .sort((x, y) => new Date(x.start) - new Date(y.start))[0];

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useGSAP(() => {
    if (!upcoming || reducedMotion()) return;
    gsap.from(root.current.children, {
      autoAlpha: 0, y: 24, duration: 1, stagger: 0.15, ease: "power3.out",
      scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
    });
  }, { scope: root, dependencies: [!!upcoming] });

  if (!upcoming) return null;

  const diff = Math.max(0, new Date(upcoming.start).getTime() - now);
  const d = Math.floor(diff / 864e5);
  const h = Math.floor(diff / 36e5) % 24;
  const m = Math.floor(diff / 6e4) % 60;
  const s = Math.floor(diff / 1e3) % 60;

  return (
    <section className="page countdown" ref={root}>
      <p className="kicker">{events.length > 1 ? t("countdownToMany", { title: upcoming.title }) : t("countdownTo", { title: upcoming.title })}</p>
      <div className="cd-grid">
        {[[t("days"), pad(d)], [t("hours"), pad(h)], [t("minutes"), pad(m)], [t("seconds"), pad(s)]].map(([label, v]) => (
          <div className="cd-cell" key={label}>
            <Num value={v} />
            <span className="cd-lbl">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
