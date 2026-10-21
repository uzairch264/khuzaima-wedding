import React, { useRef } from "react";
import { describeEvent, mapUrl, calendarHref } from "../lib/invite";
import { useLang } from "../lib/i18n";
import { gsap, useGSAP, reducedMotion } from "../lib/gsap";
import Illustration from "./Illustrations";
import Flowers from "./Flowers";

function EventCard({ id }) {
  const { W, t, clock, locale } = useLang();
  const ev = W.events[id];
  const d = describeEvent(ev, locale);
  const cal = calendarHref(ev, `${W.couple[0].name}`);

  return (
    <article className={`event event--${id}`}>
      <Illustration id={id} />
      <div className="event-card">
        <p className="kicker">{t(`kicker_${id}`)}</p>
        <h3 className="event-title">{ev.title}</h3>
        <p className="event-blurb">{ev.blurb}</p>
        <span className="rule" aria-hidden="true" />
        <p className="event-date">{d.weekday} · {d.day} {d.month} {d.year}</p>
        <ul className="program">
          {ev.program.map((p) => {
            const c = clock(p.time);
            return <li key={p.label}><span>{p.label}</span><b>{c.hm}<small>{c.ap}</small></b></li>;
          })}
        </ul>
        <span className="rule" aria-hidden="true" />
        <p className="event-venue">{ev.venue}</p>
        {ev.address && <p className="event-addr">{ev.address}</p>}
        <div className="links">
          {(ev.map || ev.address) && <a href={mapUrl(ev)} target="_blank" rel="noopener noreferrer">{t("viewMap")}</a>}
          <a href={cal.href} download={cal.download} target={cal.download ? undefined : "_blank"} rel="noopener noreferrer">{t("addCal")}</a>
        </div>
      </div>
    </article>
  );
}

export default function Celebrations({ events }) {
  const root = useRef(null);
  const { t, num, lang } = useLang();
  const n = events.length;

  useGSAP(() => {
    if (reducedMotion()) return;
    gsap.from(".celebrations-head > *", {
      autoAlpha: 0, y: 22, duration: 1, stagger: 0.15, ease: "power3.out",
      scrollTrigger: { trigger: ".celebrations-head", start: "top 80%", once: true },
    });
    gsap.utils.toArray(".event").forEach((el) => {
      const st = { trigger: el, start: "top 85%", once: true };
      gsap.from(el.querySelector(".ill"), { autoAlpha: 0, y: 30, scale: 0.94, duration: 1.2, ease: "power3.out", scrollTrigger: st });
      gsap.from(el.querySelectorAll(".event-card > *"), { autoAlpha: 0, y: 14, duration: 0.8, stagger: 0.07, delay: 0.25, ease: "power2.out", scrollTrigger: st });
    });
  }, { scope: root, dependencies: [lang] });

  return (
    <section className="page celebrations" id="celebrations" ref={root}>
      <Flowers className="flowers--tr" />
      <div className="celebrations-head">
        <h2 className="script-title">{n === 1 ? t("celebration") : t("celebrations")}</h2>
        <p className="lede">
          {n === 1 ? t("ledeOne") : t("ledeMany", { n: num(n), all: n === 2 ? t("both") : t("allThree") })}
        </p>
      </div>
      <div className="events" style={{ "--n": n }}>
        {events.map((id) => <EventCard key={id} id={id} />)}
      </div>
    </section>
  );
}
