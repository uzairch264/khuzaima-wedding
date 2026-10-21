import React, { useState } from "react";
import WEDDING from "../config";
import { ORDER } from "../lib/invite";

/** Family-only helper at /#links — builds a personalised invitation link. */
export default function LinkMaker() {
  const [picked, setPicked] = useState(["mehndi", "barat", "walima"]);
  const [guest, setGuest] = useState("");
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState("en");

  const toggle = (k) => setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));
  const params = [...ORDER.filter((k) => picked.includes(k)).map((k) => [].concat(WEDDING.events[k].code)[0]), ...(guest.trim() ? [`to=${encodeURIComponent(guest.trim())}`] : []), ...(lang === "ur" ? ["lang=ur"] : [])].join("&");
  const base = window.location.href.split("#")[0].split("?")[0];
  const url = params ? `${base}?${params}` : base;

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ }
  };

  return (
    <main className="link-maker">
      <p className="kicker">For the family</p>
      <h1 className="script-title">Link Maker</h1>
      <div className="rsvp-card">
        <div className="field">
          <span>Events to invite them to</span>
          <div className="pills three">
            {ORDER.map((k) => (
              <label key={k}>
                <input type="checkbox" checked={picked.includes(k)} onChange={() => toggle(k)} />
                <span>{WEDDING.events[k].title}</span>
              </label>
            ))}
          </div>
          <small className="hint">Nothing ticked = simple “getting married” announcement only.</small>
        </div>
        <label className="field">
          <span>Guest / family name <em>(optional)</em></span>
          <input type="text" value={guest} onChange={(e) => setGuest(e.target.value)} placeholder="e.g. Khan Family" />
        </label>
        <div className="field">
          <span>Language</span>
          <div className="pills">
            <label><input type="radio" name="lang" checked={lang === "en"} onChange={() => setLang("en")} /><span>English</span></label>
            <label><input type="radio" name="lang" checked={lang === "ur"} onChange={() => setLang("ur")} /><span>اردو</span></label>
          </div>
        </div>
        <div className="field">
          <span>Link</span>
          <code className="link-out">{url}</code>
        </div>
        <div className="actions">
          <button className="btn btn-gold" type="button" onClick={copy}>{copied ? "Copied ✓" : "Copy link"}</button>
          <a className="btn btn-gold" href={url} target="_blank" rel="noopener noreferrer">Preview</a>
        </div>
      </div>
    </main>
  );
}
