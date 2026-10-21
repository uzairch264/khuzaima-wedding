import WEDDING from "../config";

export const ORDER = ["mehndi", "barat", "walima"];

const RESERVED = new Set(["to", "guest", "events", "e", "lang"]);
const OFF = new Set(["0", "false", "no", "off"]);

const tokens = (s) => s.toLowerCase().split(/[\s,\-_|+]+/).filter(Boolean);

/** code -> event id, from config (e.g. "0301" -> "mehndi"). Event names in the URL are NOT accepted. */
const byCode = () => Object.fromEntries(ORDER.filter((k) => WEDDING.events[k]).map((k) => [String(WEDDING.events[k].code), k]));

/**
 * ?0301 | ?0301&0707 | ?0301&973 | ?events=0301,0707 | ?e=0301-0707   (+ optional &to=Guest%20Name)
 * Codes are set per event in config.js. No valid code => announcement mode (empty events array).
 */
export function parseInvite(search = window.location.search) {
  const params = new URLSearchParams(search);
  const codes = byCode();
  const found = new Set();
  const add = (t) => codes[t] && found.add(codes[t]);

  for (const [key, value] of params.entries()) {
    const k = key.toLowerCase();
    if (RESERVED.has(k)) {
      if (k === "events" || k === "e") tokens(value).forEach(add);
      continue;
    }
    if (OFF.has(value.toLowerCase())) continue;
    tokens(k).forEach(add);
  }

  const events = ORDER.filter((k) => found.has(k) && WEDDING.events[k]);
  const guest = (params.get("to") || params.get("guest") || "").trim().slice(0, 40);
  return { events, guest };
}

const fmt = (opts, d, locale = "en-GB") => new Intl.DateTimeFormat(locale, { timeZone: "Asia/Karachi", ...opts }).format(d);

export function describeEvent(ev, locale = "en-GB") {
  const s = new Date(ev.start);
  const e = new Date(ev.end);
  const t = { hour: "numeric", minute: "2-digit", hour12: true };
  return {
    weekday: fmt({ weekday: "long" }, s, locale),
    day: new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Karachi", day: "numeric" }).format(s),
    month: fmt({ month: "long" }, s, locale),
    year: new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Karachi", year: "numeric" }).format(s),
    time: `${fmt(t, s).toUpperCase()} onwards`,
    range: `${fmt(t, s).toUpperCase()} – ${fmt(t, e).toUpperCase()}`,
  };
}

export const mapUrl = (ev) =>
  ev.map || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ev.venue} ${ev.address}`.trim())}`;

const stamp = (iso) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function calendarHref(ev, coupleLabel) {
  const title = `${ev.title} — ${coupleLabel}`;
  const where = [ev.venue, ev.address].filter(Boolean).join(", ");
  const apple = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) && "ontouchend" in document;
  if (apple) {
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding//EN", "BEGIN:VEVENT",
      `UID:${stamp(ev.start)}-${ev.title}@wedding`, `DTSTAMP:${stamp(new Date().toISOString())}`,
      `DTSTART:${stamp(ev.start)}`, `DTEND:${stamp(ev.end)}`,
      `SUMMARY:${title}`, `LOCATION:${where}`, "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    return { href: `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`, download: `${ev.title}.ics` };
  }
  const q = new URLSearchParams({
    action: "TEMPLATE", text: title, dates: `${stamp(ev.start)}/${stamp(ev.end)}`, location: where,
  });
  return { href: `https://calendar.google.com/calendar/render?${q}`, download: undefined };
}

export const joinList = (arr) =>
  arr.length <= 1 ? arr.join("") : `${arr.slice(0, -1).join(", ")} & ${arr[arr.length - 1]}`;

/** "7 – 9 November 2026" for the invited events (single date if they all fall on one day). */
export function dateRange(evs, locale = "en-GB") {
  const ds = evs.map((e) => new Date(e.start)).sort((a, b) => a - b);
  if (!ds.length) return "";
  const first = ds[0];
  const last = ds[ds.length - 1];
  const n = (o, d) => new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Karachi", ...o }).format(d);
  const m = (d) => fmt({ month: "long" }, d, locale);
  const [d1, d2] = [n({ day: "numeric" }, first), n({ day: "numeric" }, last)];
  const [m1, m2] = [m(first), m(last)];
  const [y1, y2] = [n({ year: "numeric" }, first), n({ year: "numeric" }, last)];
  if (first.toDateString() === last.toDateString() || (d1 === d2 && m1 === m2 && y1 === y2)) return `${d1} ${m1} ${y1}`;
  if (m1 === m2 && y1 === y2) return `${d1} – ${d2} ${m1} ${y1}`;
  return `${d1} ${m1} – ${d2} ${m2} ${y2}`;
}
