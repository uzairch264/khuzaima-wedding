import React from "react";

// swag of small round blooms/bulbs along a drooping curve
const swag = (x0, x1, y0, sag, n) =>
  Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n;
    return { x: x0 + (x1 - x0) * t, y: y0 + 4 * sag * t * (1 - t), i };
  });

const Curtain = ({ fill, edge, mirror }) => (
  <g transform={mirror ? "translate(300 0) scale(-1 1)" : undefined}>
    <path d="M18 8 C10 52 30 104 50 160 L88 160 C76 106 70 54 100 12Z" fill={fill} stroke={edge} strokeWidth=".8" />
    <path d="M34 20 C30 60 44 110 60 158 M52 16 C50 60 60 112 72 158" stroke={edge} strokeWidth=".6" fill="none" opacity=".7" />
  </g>
);

function Mehndi() {
  const marigolds = [...swag(18, 150, 10, 22, 11), ...swag(150, 282, 10, 22, 11)];
  return (
    <svg viewBox="0 0 300 170" role="img" aria-label="A marigold mehndi stage">
      <defs>
        <linearGradient id="ill-cream" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#f7efd8" /><stop offset=".5" stopColor="#fffaf0" /><stop offset="1" stopColor="#efe3c4" /></linearGradient>
      </defs>
      <line x1="8" y1="8" x2="292" y2="8" stroke="#cdb98a" strokeWidth="2" />
      <Curtain fill="url(#ill-cream)" edge="#e0d3ae" />
      <Curtain fill="url(#ill-cream)" edge="#e0d3ae" mirror />
      {marigolds.map((m) => (
        <g key={m.i + "-" + m.x}>
          <circle cx={m.x} cy={m.y} r="6.5" fill={m.i % 2 ? "#f0a23a" : "#f7c85a"} />
          <circle cx={m.x} cy={m.y} r="2.4" fill="#fbe39a" />
        </g>
      ))}
      <g fill="#f0a23a">{[30, 44, 58].map((y, k) => <circle key={k} cx="22" cy={y} r="5" fill={k % 2 ? "#f7c85a" : "#f0a23a"} />)}{[30, 44, 58].map((y, k) => <circle key={k} cx="278" cy={y} r="5" fill={k % 2 ? "#f7c85a" : "#f0a23a"} />)}</g>
      <ellipse cx="60" cy="104" rx="7" ry="4" fill="#d9bf7a" />
      <ellipse cx="240" cy="104" rx="7" ry="4" fill="#d9bf7a" />
      <rect x="82" y="104" width="136" height="30" rx="12" fill="#f6edd6" stroke="#e2d4ac" />
      <rect x="70" y="124" width="160" height="26" rx="10" fill="#efe3c6" stroke="#dccb9d" />
      {[[92, 110, "#f1b84b", -6], [122, 108, "#f6d98b", 4], [172, 108, "#e9a23a", -3], [200, 110, "#f6d98b", 7]].map(([x, y, c, r], i) => (
        <rect key={i} x={x} y={y} width="28" height="22" rx="7" fill={c} transform={`rotate(${r} ${x + 14} ${y + 11})`} opacity=".95" />
      ))}
      {[44, 256].map((x) => (
        <g key={x}>
          <path d={`M${x - 8} 128 h16 l-3 22 h-10Z`} fill="#f5e2b0" stroke="#b9953f" strokeWidth=".8" />
          <path d={`M${x - 6} 128 q6 -14 12 0`} fill="none" stroke="#b9953f" strokeWidth=".8" />
        </g>
      ))}
      <ellipse cx="150" cy="158" rx="118" ry="6" fill="#f2c869" opacity=".28" />
    </svg>
  );
}

function Barat() {
  const lights = swag(66, 234, 62, 26, 12);
  const arch = [];
  for (let a = 180; a <= 360; a += 15) {
    const t = (a * Math.PI) / 180;
    arch.push({ x: 150 + 90 * Math.cos(t), y: 78 + 62 * Math.sin(t) });
  }
  for (let y = 84; y <= 150; y += 11) { arch.push({ x: 60, y }); arch.push({ x: 240, y }); }
  return (
    <svg viewBox="0 0 300 170" role="img" aria-label="A rose arch with fairy lights">
      <path d="M60 160 V78 C60 40 100 16 150 16 C200 16 240 40 240 78 V160" fill="#fbf7ee" stroke="#cdbf9a" strokeWidth="1.6" />
      <path d="M72 160 V80 C72 48 106 28 150 28 C194 28 228 48 228 80 V160" fill="none" stroke="#e1d7bb" strokeWidth=".8" strokeDasharray="2 4" />
      {arch.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="8" fill={i % 3 ? "#e4b8b8" : "#f1d3d0"} stroke="#d9a3a6" strokeWidth=".6" />
          <circle cx={p.x} cy={p.y} r="3.2" fill="#d79aa0" opacity=".8" />
          {i % 2 === 0 && <ellipse cx={p.x + 7} cy={p.y + 5} rx="5" ry="2.4" fill="#a9bba5" transform={`rotate(30 ${p.x + 7} ${p.y + 5})`} />}
        </g>
      ))}
      <path d="M66 62 Q150 114 234 62" fill="none" stroke="#e6d7ad" strokeWidth=".8" />
      {lights.map((l) => (
        <circle key={l.i} cx={l.x} cy={l.y} r="3" fill="#ffe3a0" className="twinkle" style={{ animationDelay: `${-(l.i % 5) * 0.4}s`, filter: "drop-shadow(0 0 4px #f8cf72)" }} />
      ))}
      {[104, 196].map((x) => (
        <g key={x}>
          <rect x={x - 6} y="120" width="12" height="36" rx="2" fill="#fffdf6" stroke="#e3dcc8" />
          <ellipse cx={x} cy="115" rx="3" ry="6" fill="#ffd77a" className="twinkle" style={{ filter: "drop-shadow(0 0 5px #f8cf72)" }} />
        </g>
      ))}
      <ellipse cx="150" cy="160" rx="100" ry="5" fill="#d9bf7a" opacity=".25" />
    </svg>
  );
}

function Walima() {
  const strands = [92, 108, 124, 140, 156, 172, 188, 204].map((x, i) => ({ x, h: 36 + ((i * 29) % 46) }));
  return (
    <svg viewBox="0 0 300 170" role="img" aria-label="Silver drapes with hanging crystals and candles">
      <defs>
        <linearGradient id="ill-silver" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#dedcd6" /><stop offset=".5" stopColor="#f6f5f1" /><stop offset="1" stopColor="#d3d1ca" /></linearGradient>
      </defs>
      <path d="M14 10 Q150 54 286 10" fill="none" stroke="#d3d1ca" strokeWidth="8" strokeLinecap="round" />
      <path d="M14 10 Q150 40 286 10 L286 18 Q150 62 14 18Z" fill="url(#ill-silver)" stroke="#cfcdc5" strokeWidth=".6" />
      <Curtain fill="url(#ill-silver)" edge="#cfcdc5" />
      <Curtain fill="url(#ill-silver)" edge="#cfcdc5" mirror />
      {strands.map((s) => (
        <g key={s.x}>
          <line x1={s.x} y1={s.x < 150 ? 20 + (150 - s.x) * 0.1 : 20 + (s.x - 150) * 0.1} x2={s.x} y2={34 + s.h} stroke="#b8bdb8" strokeWidth=".7" />
          <path d={`M${s.x} ${34 + s.h} l4 6 l-4 8 l-4 -8Z`} fill="#fff" stroke="#aeb4b0" strokeWidth=".6" className="twinkle" style={{ animationDelay: `${-(s.x % 7) * 0.3}s`, filter: "drop-shadow(0 0 3px #ffffff)" }} />
        </g>
      ))}
      {[[112, 128, 24], [128, 120, 36], [146, 112, 44], [164, 122, 34], [180, 130, 26], [96, 136, 18], [196, 136, 18]].map(([x, y, h], i) => (
        <g key={i}>
          <rect x={x - 7} y={y + 30 - h + 6} width="14" height={h} rx="2" fill="#fffefb" stroke="#e2e0d8" />
          <ellipse cx={x} cy={y + 30 - h} rx="2.4" ry="5" fill="#ffe1a0" className="twinkle" style={{ animationDelay: `${-i * 0.35}s`, filter: "drop-shadow(0 0 4px #f8cf72)" }} />
        </g>
      ))}
      <ellipse cx="150" cy="162" rx="90" ry="5" fill="#bfc5bf" opacity=".3" />
    </svg>
  );
}

export default function Illustration({ id }) {
  const Ill = { mehndi: Mehndi, barat: Barat, walima: Walima }[id];
  return <div className={`ill ill--${id}`}><Ill /></div>;
}
