import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import WEDDING from "../config";

/** UI strings. Event/people content lives in config.js (`ur` block). */
const STR = {
  en: {
    giftKicker: "A precious gift, wrapped just for you",
    giftFor: "For",
    giftYou: "You",
    tapHint: "Tap the seal to open",
    youreInvited: "You're Invited",
    bigNews: "Big News",
    theInvitation: "The invitation",
    bigNewsKicker: "Big news",
    dear: "Dear {name},",
    daughterOfJoin: "Join us for",
    scrollDown: "Scroll down",
    keepScrolling: "Keep scrolling",
    toBeHeldAt: "To be held at",
    atTime: "At {time}",
    inTheName: "In the name of Allah",
    verse: "“And among His signs is that He created for you mates from among yourselves, that you may find tranquillity in them; and He placed between you affection and mercy.”",
    verseRef: "Surah Ar-Rum · 30:21",
    homesOne: "Our two homes open their doors for the {title} — and it is not complete without you.",
    homesMany: "Our two homes open their doors. {n} celebrations of it — and none of them complete without you.",
    family: "Family",
    celebration: "The Celebration",
    celebrations: "The Celebrations",
    ledeOne: "A place is kept for you.",
    ledeMany: "{n} evenings, each with its own character. A place is kept for you at {all}.",
    both: "both",
    allThree: "all three",
    kicker_mehndi: "The first evening",
    kicker_barat: "The grand evening",
    kicker_walima: "The final evening",
    viewMap: "View on map",
    addCal: "Add to calendar",
    countdownTo: "Counting down to the {title}",
    countdownToMany: "Counting down to the {title} celebration",
    days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds",
    contact: "R.S.V.P",
    dua: "May Allah bless you both, shower His blessings upon you, and unite you in goodness.",
    withLove: "With love & duas",
    lookingForward: "Looking forward",
    finaleLine: "We ask for the pleasure of your company, and for your prayers.",
    mute: "Mute music",
    unmute: "Play music",
    langBtn: "اردو",
    am: "AM", pm: "PM",
  },
  ur: {
    giftKicker: "آپ کے لیے ایک خاص تحفہ",
    giftFor: "برائے",
    giftYou: "آپ",
    tapHint: "کھولنے کے لیے مہر پر ٹیپ کریں",
    youreInvited: "آپ مدعو ہیں",
    bigNews: "خوشخبری",
    theInvitation: "دعوتِ نامہ",
    bigNewsKicker: "خوشخبری",
    dear: "محترم {name}،",
    daughterOfJoin: "ہماری تقریبات",
    scrollDown: "نیچے جائیں",
    keepScrolling: "نیچے دیکھتے رہیے",
    toBeHeldAt: "مقام",
    atTime: "{time} بجے سے",
    inTheName: "اللہ کے نام سے",
    verse: "“اور اس کی نشانیوں میں سے ہے کہ اس نے تمہارے لیے تم ہی میں سے جوڑے پیدا کیے تاکہ تم ان کے پاس سکون پاؤ، اور اس نے تمہارے درمیان محبت اور رحمت رکھ دی۔”",
    verseRef: "سورۃ الروم · 30:21",
    homesOne: "ہمارے دونوں گھرانے {title} کے لیے اپنے دروازے کھول رہے ہیں — آپ کے بغیر یہ خوشی ادھوری ہے۔",
    homesMany: "ہمارے دونوں گھرانے آپ کے لیے اپنے دروازے کھولتے ہیں۔ {n} تقریبات — اور ان میں سے کوئی بھی آپ کے بغیر مکمل نہیں۔",
    family: "خاندان",
    celebration: "تقریب",
    celebrations: "تقریبات",
    ledeOne: "آپ کے لیے جگہ محفوظ ہے۔",
    ledeMany: "{n} شامیں، ہر ایک اپنے رنگ میں۔ {all} میں آپ کے لیے جگہ محفوظ ہے۔",
    both: "دونوں",
    allThree: "تینوں",
    kicker_mehndi: "پہلی شام",
    kicker_barat: "بارات کی شام",
    kicker_walima: "آخری تقریب",
    viewMap: "نقشہ دیکھیں",
    addCal: "کیلنڈر میں شامل کریں",
    countdownTo: "{title} میں باقی وقت",
    countdownToMany: "{title} کی تقریب میں باقی وقت",
    days: "دن", hours: "گھنٹے", minutes: "منٹ", seconds: "سیکنڈ",
    contact: "رابطہ",
    dua: "اللہ آپ دونوں کو برکت دے، آپ پر برکتیں نازل فرمائے اور آپ کو خیر میں جمع رکھے۔",
    withLove: "محبت اور دعاؤں کے ساتھ",
    lookingForward: "منتظرِ کرم",
    finaleLine: "ہم آپ کی شرکت اور آپ کی دعاؤں کے طلبگار ہیں۔",
    mute: "موسیقی بند کریں",
    unmute: "موسیقی چلائیں",
    langBtn: "EN",
  },
};

const NUM_UR = ["", "ایک", "دو", "تین"];
const NUM_EN = ["", "One", "Two", "Three"];

const merge = (base, over) => {
  if (over === undefined || over === null || over === "") return base;
  if (Array.isArray(base)) return base.map((b, i) => merge(b, over[i]));
  if (base && typeof base === "object") {
    const out = { ...base };
    for (const k of Object.keys(over)) out[k] = merge(base[k], over[k]);
    return out;
  }
  return over;
};

const LangCtx = createContext(null);
export const useLang = () => useContext(LangCtx);

const initialLang = () => {
  try {
    const q = new URLSearchParams(window.location.search).get("lang");
    if (q === "ur" || q === "en") return q;
    const saved = window.localStorage.getItem("wedding-lang");
    if (saved === "ur" || saved === "en") return saved;
  } catch { /* storage may be blocked */ }
  return "en";
};

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((l) => {
    setLangState(l);
    try { window.localStorage.setItem("wedding-lang", l); } catch { /* ignore */ }
  }, []);

  const value = useMemo(() => {
    const { ur, ...en } = WEDDING;
    const W = lang === "ur" ? merge(en, ur) : en;
    const t = (key, vars = {}) =>
      (STR[lang][key] ?? STR.en[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
    const num = (n) => (lang === "ur" ? NUM_UR[n] : NUM_EN[n]);
    // "6:00 PM" -> { hm: "6:00", ap: "PM" | "شام" }
    const clock = (time) => {
      const [hm, ap] = time.split(" ");
      if (lang !== "ur") return { hm, ap };
      let h = parseInt(hm, 10) % 12;
      if (ap === "PM") h += 12;
      const word = h < 12 ? "صبح" : h < 16 ? "دوپہر" : h < 19 ? "شام" : "رات";
      return { hm, ap: word };
    };
    const join = (arr) =>
      arr.length <= 1 ? arr.join("") : `${arr.slice(0, -1).join("، ")} ${lang === "ur" ? "اور" : "&"} ${arr[arr.length - 1]}`.replace(/^(.*?)$/, (m) => (lang === "ur" ? m : arr.length > 2 ? m.replace(/، /g, ", ") : m));
    return { lang, setLang, W, t, num, clock, join, locale: lang === "ur" ? "ur-PK" : "en-GB" };
  }, [lang, setLang]);

  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}
