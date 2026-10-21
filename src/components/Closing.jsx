import React, { useRef } from "react";
import { useLang } from "../lib/i18n";
import { gsap, useGSAP, reducedMotion } from "../lib/gsap";

const intl = (p) => `92${p.replace(/\D/g, "").replace(/^0/, "")}`;

export default function Closing({ announce }) {
  const root = useRef(null);
  const { W, t, lang } = useLang();

  useGSAP(() => {
    if (reducedMotion()) return;
    gsap.from(root.current.children, {
      autoAlpha: 0, y: 20, duration: 1, stagger: 0.18, ease: "power3.out",
      scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
    });
  }, { scope: root, dependencies: [lang] });

  return (
    <section className="page closing" ref={root}>
      <p className="dua" lang="ar">بَارَكَ ٱللَّٰهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ</p>
      <p className="dua-en">{t("dua")}</p>
      <p className="signoff">{announce ? t("withLove") : W.signOff}</p>
      {!announce && (
        <>
          <div className="looking">
            <p className="kicker">{t("lookingForward")}</p>
            <p>{W.lookingForward}</p>
          </div>
          {W.rsvpContacts?.length > 0 && (
            <div className="contacts">
              <p className="kicker">{t("contact")}</p>
              {W.elders && <p className="elders">{W.elders}</p>}
              {W.rsvpContacts.map((c) => (c.phone ? (
                <a key={c.name} href={`tel:+${intl(c.phone)}`}><b>{c.name}</b><span dir="ltr">{c.phone}</span></a>
              ) : (
                <div key={c.name} className="contact-plain"><b>{c.name}</b></div>
              )))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
