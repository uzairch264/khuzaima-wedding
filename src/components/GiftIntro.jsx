import React, { useRef, useState } from "react";
import confetti from "canvas-confetti";
import { gsap, useGSAP, reducedMotion } from "../lib/gsap";
import { useLang } from "../lib/i18n";

const GOLD = ["#e8d49a", "#c9b27a", "#ffffff", "#a9bba5", "#f1d3d0", "#f6efdc"];

export default function GiftIntro({ guest, initials, title, onOpen, onDone }) {
  const { t } = useLang();
  const root = useRef(null);
  const busy = useRef(false);
  const [gone, setGone] = useState(false);

  // idle animation: gentle float + shimmering light
  useGSAP(() => {
    if (reducedMotion()) return;
    gsap.to(".gift", { y: -8, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.from(".gift", { scale: 0.6, autoAlpha: 0, duration: 1.4, ease: "back.out(1.5)" });
    gsap.from(".intro-kicker, .tap-hint", { autoAlpha: 0, y: 14, duration: 1, delay: 0.7, stagger: 0.2 });
  }, { scope: root });

  const { contextSafe } = useGSAP({ scope: root });

  const open = contextSafe(() => {
    if (busy.current) return;
    busy.current = true;
    onOpen?.();

    const q = (s) => root.current.querySelector(s);
    const gift = q(".gift");
    const quick = reducedMotion();
    const rect = q(".box").getBoundingClientRect();
    const origin = {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height * 0.15) / window.innerHeight,
    };

    gsap.killTweensOf(".gift");
    const h = gift.getBoundingClientRect().height;

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => { setGone(true); onDone?.(); },
    });

    if (quick) {
      tl.to(root.current, { autoAlpha: 0, duration: 0.4 });
      return;
    }

    tl.to(".tap-hint, .intro-kicker", { autoAlpha: 0, y: 10, duration: 0.4 }, 0)
      .to(".seal", { scale: 1.5, autoAlpha: 0, duration: 0.5, ease: "back.in(2)" }, 0)
      .to(".tag", { y: 120, rotate: 40, autoAlpha: 0, duration: 0.7, ease: "power2.in" }, 0.05)
      .to(".ribbon-h--l", { xPercent: -105, duration: 0.7 }, 0.25)
      .to(".ribbon-h--r", { xPercent: 105, duration: 0.7 }, 0.25)
      .to(".box > .ribbon-v", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.5 }, 0.3)
      // lid flies open
      .to(".lid", { rotate: -112, x: -h * 0.22, y: -h * 0.12, duration: 0.9, ease: "back.in(1.3)" }, 0.55)
      .to(".lid", { autoAlpha: 0, duration: 0.35 }, 1.2)
      // light bursts out
      .fromTo(".gift-glow", { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1.25, duration: 0.9, ease: "power2.out" }, 0.85)
      .fromTo(".rays", { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: "power2.out" }, 0.9)
      .to(".rays", { rotate: 50, duration: 3.4, ease: "none" }, 0.9)
      .add(() => {
        const fire = (n, spread, vel, scalar) => confetti({
          particleCount: n, spread, startVelocity: vel, origin, colors: GOLD, scalar, ticks: 220, gravity: 0.8, shapes: ["circle", "square"],
        });
        fire(90, 120, 46, 1);
        setTimeout(() => fire(60, 70, 34, 0.8), 160);
        setTimeout(() => fire(40, 160, 24, 0.6), 340);
      }, 1.0)
      // invitation card rises out of the box…
      .to(".rise-card", { y: -h * 0.62, duration: 1.1, ease: "power3.out" }, 1.25)
      .to(".rise-card", { rotate: -3, duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut" }, 1.4)
      // …then we fly through it into the invitation
      .to(".rise-card", { scale: 7, y: -h * 0.5, duration: 1.15, ease: "power3.in" }, 2.55)
      .to(".box, .rays, .gift-glow", { autoAlpha: 0, duration: 0.5 }, 2.6)
      .to(root.current, { backgroundColor: "rgba(255,250,240,0)", autoAlpha: 0, duration: 0.6, ease: "power1.in" }, 3.25);
  });

  if (gone) return null;

  return (
    <div id="intro" ref={root} role="dialog" aria-label="Your gift">
      <div className="intro-spot" />
      <p className="intro-kicker">{t("giftKicker")}</p>

      <div className="gift" id="gift">
        <div className="rays" aria-hidden="true" />
        <div className="gift-glow" aria-hidden="true" />

        <div className="rise-card">
          <span className="rise-bis" lang="ar">بسم الله</span>
          <span className="rise-title">{title}</span>
          <span className="rise-orn">❦</span>
        </div>

        <div className="box">
          <svg className="filigree" viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#d6c28a" /><stop offset=".5" stopColor="#9aa896" /><stop offset="1" stopColor="#d6c28a" />
              </linearGradient>
            </defs>
            <rect x="10" y="10" width="280" height="180" rx="6" fill="none" stroke="url(#goldGrad)" strokeWidth="1.2" />
            <rect x="16" y="16" width="268" height="168" rx="4" fill="none" stroke="url(#goldGrad)" strokeWidth=".6" strokeDasharray="2 4" />
            <g fill="none" stroke="url(#goldGrad)" strokeWidth="1.1">
              <path d="M22 40 C22 22 30 22 40 22 M22 52 C30 50 34 44 34 34 C44 34 50 30 52 22" />
              <path d="M278 40 C278 22 270 22 260 22 M278 52 C270 50 266 44 266 34 C256 34 250 30 248 22" />
              <path d="M22 160 C22 178 30 178 40 178 M22 148 C30 150 34 156 34 166 C44 166 50 170 52 178" />
              <path d="M278 160 C278 178 270 178 260 178 M278 148 C270 150 266 156 266 166 C256 166 250 170 248 178" />
            </g>
          </svg>
          <div className="ribbon ribbon-v" aria-hidden="true" />
          <div className="ribbon ribbon-h ribbon-h--l" aria-hidden="true" />
          <div className="ribbon ribbon-h ribbon-h--r" aria-hidden="true" />
          <button className="seal" onClick={open} aria-label="Open your gift">
            <span>{initials}</span>
          </button>
        </div>

        <div className="lid">
          <div className="ribbon ribbon-v" aria-hidden="true" />
          <svg className="bow" viewBox="0 0 160 90" aria-hidden="true">
            <defs>
              <linearGradient id="bowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#dfe6dc" /><stop offset=".55" stopColor="#a7b8a4" /><stop offset="1" stopColor="#7a8f78" />
              </linearGradient>
            </defs>
            <path d="M80 52 C55 20 18 8 10 30 C4 48 40 62 80 52Z" fill="url(#bowGrad)" stroke="#62775f" strokeWidth="1.2" />
            <path d="M80 52 C105 20 142 8 150 30 C156 48 120 62 80 52Z" fill="url(#bowGrad)" stroke="#62775f" strokeWidth="1.2" />
            <path d="M74 56 L52 88 L64 84 L70 90 L80 58Z" fill="url(#bowGrad)" stroke="#62775f" />
            <path d="M86 56 L108 88 L96 84 L90 90 L80 58Z" fill="url(#bowGrad)" stroke="#62775f" />
            <ellipse cx="80" cy="52" rx="11" ry="9" fill="url(#bowGrad)" stroke="#62775f" strokeWidth="1.2" />
            <path d="M28 30 C40 26 56 34 68 46" fill="none" stroke="#ffffff" strokeOpacity=".6" strokeWidth="1.5" />
            <path d="M132 30 C120 26 104 34 92 46" fill="none" stroke="#ffffff" strokeOpacity=".6" strokeWidth="1.5" />
          </svg>
          <div className="tag">
            <span className="tag-string" />
            <span className="tag-body"><small>{t("giftFor")}</small><b>{guest || t("giftYou")}</b></span>
          </div>
        </div>
      </div>

      <p className="tap-hint"><span>{t("tapHint")}</span></p>
    </div>
  );
}
