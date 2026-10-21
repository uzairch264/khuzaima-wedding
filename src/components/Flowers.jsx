import React from "react";

const f = (n) => +n.toFixed(1);

// soft white roses, tucked-in leaves and baby's-breath — drawn in code so no image files are needed
const ROSES = [
  { x: 62, y: 58, r: 36, rot: 0 },
  { x: 126, y: 98, r: 30, rot: 24 },
  { x: 50, y: 132, r: 24, rot: -14 },
  { x: 118, y: 32, r: 21, rot: 40 },
  { x: 168, y: 62, r: 17, rot: 12 },
  { x: 22, y: 20, r: 18, rot: 60 },
];
const LEAVES = [
  [92, 10, -20, 1.1], [150, 38, 20, 1], [24, 92, 110, 1], [88, 126, 60, 1.1], [164, 112, 30, 0.9],
  [10, 152, 80, 0.9], [138, 76, -40, .9], [70, 100, 160, .8], [188, 90, 10, .8],
];
const SPRIGS = [[170, 20, 40], [186, 52, 70], [100, 150, 130], [20, 174, 100], [150, 134, 20]];

export function Rose({ x, y, r, rot }) {
  const petal = (k, s) => (
    <path
      key={`${k}-${s}`}
      d={`M0 0 C${f(r * 0.95 * s)} ${f(-r * 0.15 * s)} ${f(r * 0.95 * s)} ${f(-r * 0.98 * s)} 0 ${f(-r * 0.82 * s)}`}
      transform={`rotate(${k * 72 + (s < 1 ? 36 : 0)})`}
      fill="url(#fl-petal)" stroke="#d3cbbc" strokeWidth=".5"
    />
  );
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <circle r={r} fill="url(#fl-base)" stroke="#d9d2c4" strokeWidth=".6" />
      {[0, 1, 2, 3, 4].map((k) => petal(k, 1))}
      {[0, 1, 2, 3, 4].map((k) => petal(k, 0.62))}
      <path d={`M0 0 C${f(r * 0.2)} ${f(-r * 0.05)} ${f(r * 0.2)} ${f(-r * 0.3)} 0 ${f(-r * 0.26)} C${f(-r * 0.18)} ${f(-r * 0.22)} ${f(-r * 0.12)} ${f(r * 0.1)} ${f(r * 0.04)} ${f(r * 0.1)}`} fill="none" stroke="#c9b8a8" strokeWidth=".7" />
      <circle r={f(r * 0.1)} fill="#e6cfc4" />
    </g>
  );
}

export const FlowerDefs = () => (
  <defs>
        <radialGradient id="fl-base" cx=".4" cy=".35" r=".8"><stop offset="0" stopColor="#ffffff" /><stop offset=".7" stopColor="#f1ede4" /><stop offset="1" stopColor="#e2dccf" /></radialGradient>
        <linearGradient id="fl-petal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#e9e3d6" /></linearGradient>
        <linearGradient id="fl-leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b3c4ae" /><stop offset="1" stopColor="#6f8a6c" /></linearGradient>
      </defs>
);

export default function Flowers({ className = "" }) {
  return (
    <svg className={`flowers ${className}`} viewBox="0 0 210 190" aria-hidden="true">
      <FlowerDefs />
      {SPRIGS.map(([x, y, a], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${a})`} stroke="#9fb09a" strokeWidth=".7" fill="none">
          <path d="M0 0 C6 -10 4 -22 10 -34" />
          <path d="M5 -12 L14 -16 M7 -22 L-2 -28 M9 -30 L17 -34" />
          {[[10, -34], [14, -16], [-2, -28], [17, -34], [9, -24]].map(([cx, cy], j) => <circle key={j} cx={cx} cy={cy} r="2.1" fill="#fff" stroke="#d8d2c4" strokeWidth=".4" />)}
        </g>
      ))}
      {LEAVES.map(([x, y, a, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
          <path d="M0 0 C12 -15 34 -15 50 0 C34 14 12 14 0 0Z" fill="url(#fl-leaf)" opacity=".92" />
          <path d="M2 0 L46 0" stroke="#f0f4ee" strokeOpacity=".6" strokeWidth=".7" />
        </g>
      ))}
      {ROSES.map((r, i) => <Rose key={i} {...r} />)}
    </svg>
  );
}
