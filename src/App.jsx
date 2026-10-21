import React, { useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import { parseInvite } from "./lib/invite";
import { LangProvider, useLang } from "./lib/i18n";
import { gsap, ScrollTrigger, reducedMotion } from "./lib/gsap";
import GiftIntro from "./components/GiftIntro";
import Hero from "./components/Hero";
import Verse from "./components/Verse";
import Celebrations from "./components/Celebrations";
import Countdown from "./components/Countdown";
import Closing from "./components/Closing";
import Finale from "./components/Finale";
import TopBar from "./components/TopBar";
import LinkMaker from "./components/LinkMaker";

function Invitation() {
  const { W, t, lang } = useLang();
  const { events, guest } = useMemo(() => parseInvite(), []);
  const announce = events.length === 0;
  const [opened, setOpened] = useState(false);
  const lenis = useRef(null);

  useEffect(() => {
    document.title = `${W.couple[0].name} — ${announce ? "Getting Married" : "Wedding Invitation"}`;
  }, [W, announce]);

  // smooth scroll, locked until the gift is opened
  useEffect(() => {
    document.body.classList.add("is-locked");
    if (reducedMotion()) return undefined;
    const l = new Lenis({ lerp: 0.09, smoothWheel: true });
    l.stop();
    lenis.current = l;
    l.on("scroll", ScrollTrigger.update);
    const tick = (time) => l.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); l.destroy(); };
  }, []);

  // text length changes with language — recalculate scroll triggers
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [lang]);

  const onDone = () => {
    document.body.classList.remove("is-locked");
    lenis.current?.start();
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  return (
    <>
      <TopBar opened={opened} />
      <GiftIntro
        guest={guest}
        initials={W.initials}
        title={announce ? t("bigNews") : t("youreInvited")}
        onOpen={() => setOpened(true)}
        onDone={onDone}
      />

      <main id="invite">
        <Hero opened={opened} events={events} guest={guest} />
        {!announce && <Verse events={events} />}
        {!announce && <Celebrations events={events} />}
        {!announce && <Countdown events={events} />}
        <Closing announce={announce} />
        <Finale events={events} />
      </main>
    </>
  );
}

export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return (
    <LangProvider>
      {hash === "#links" ? <LinkMaker /> : <Invitation />}
    </LangProvider>
  );
}
