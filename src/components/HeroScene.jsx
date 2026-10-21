import React, { useMemo } from "react";
import { Rose, FlowerDefs } from "./Flowers";
import Urn from "./Urn";

// deterministic pseudo-random so the arrangement is stable between renders
const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const f = (n) => +n.toFixed(1);

function Cluster({ x, y, r }) {
  const pts = [[0, 0], [1, 0], [0.5, 0.87], [-0.5, 0.87], [-1, 0], [-0.5, -0.87], [0.5, -0.87]];
  return (
    <g transform={`translate(${f(x)} ${f(y)})`}>
      {pts.map(([a, b], i) => (
        <circle key={i} cx={f(a * r * 0.55)} cy={f(b * r * 0.55)} r={f(r * 0.42)} fill="#fbfaf6" stroke="#dcd6c8" strokeWidth=".5" />
      ))}
      <circle r={f(r * 0.18)} fill="#efe9db" />
    </g>
  );
}

const Leaf = ({ x, y, a, s }) => (
  <path d="M0 0 C7 -9 20 -9 30 0 C20 8 7 8 0 0Z" transform={`translate(${f(x)} ${f(y)}) rotate(${f(a)}) scale(${f(s)})`} fill="url(#fl-leaf)" opacity=".93" />
);

/** The wide band of white flowers across the top, with a few trailing vines. */
function Garland() {
  const g = useMemo(() => {
    const R = rng(11);
    const leaves = Array.from({ length: 70 }, () => ({ x: R() * 820 - 10, y: 16 + R() * 64, a: R() * 360, s: 0.8 + R() * 0.9 }));
    const clusters = Array.from({ length: 24 }, () => ({ x: R() * 800, y: 26 + R() * 56, r: 11 + R() * 7 }));
    const roses = Array.from({ length: 30 }, (_, i) => {
      const x = -10 + i * 28 + (R() - 0.5) * 14;
      return { x, y: 38 + (R() - 0.5) * 30 + Math.pow(Math.abs(x - 400) / 400, 2) * 18, r: 15 + R() * 11, rot: R() * 360 };
    });
    const dots = Array.from({ length: 90 }, () => ({ x: R() * 800, y: 8 + R() * 90, r: 1.4 + R() * 1.6 }));
    const vines = [70, 150, 250, 560, 655, 740].map((x, i) => ({ x: x + (R() - 0.5) * 20, len: 44 + R() * 50, dur: 4 + R() * 3, delay: -R() * 3, flip: i % 2 ? 1 : -1 }));
    return { leaves, clusters, roses, dots, vines };
  }, []);

  return (
    <svg className="garland" viewBox="0 0 800 170" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <FlowerDefs />
      {g.leaves.map((l, i) => <Leaf key={i} {...l} />)}
      {g.clusters.map((c, i) => <Cluster key={i} {...c} />)}
      {g.roses.map((r, i) => <Rose key={i} x={r.x} y={r.y} r={r.r} rot={r.rot} />)}
      {g.dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#fff" stroke="#d8d2c4" strokeWidth=".3" />)}
      {g.vines.map((v, i) => (
        <g key={i} className="vine" style={{ animationDuration: `${v.dur}s`, animationDelay: `${v.delay}s` }} transform={`translate(${f(v.x)} 70)`}>
          <path d={`M0 0 C${v.flip * 8} ${v.len * 0.4} ${-v.flip * 6} ${v.len * 0.7} ${v.flip * 4} ${v.len}`} fill="none" stroke="#6f8a6c" strokeWidth="1.2" />
          {[0.25, 0.5, 0.75, 1].map((t, j) => (
            <g key={j} transform={`translate(${f(v.flip * 4 * t)} ${f(v.len * t)})`}>
              <Leaf x={0} y={0} a={j % 2 ? 150 : 30} s={0.5} />
              {j % 2 === 1 && <circle cx={v.flip * 3} cy={5} r="3.2" fill="#fff" stroke="#d8d2c4" strokeWidth=".4" />}
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

/** Draped ivory curtain hanging from the top corner (mirrored for the right side). */
function Drape({ side }) {
  return (
    <svg className={`drape drape--${side}`} viewBox="0 0 220 330" preserveAspectRatio="xMinYMin meet" aria-hidden="true">
      <defs>
        <linearGradient id={`dr-${side}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ece8dd" /><stop offset=".45" stopColor="#ffffff" /><stop offset="1" stopColor="#e2ddd0" />
        </linearGradient>
      </defs>
      <path d="M0 0 H222 C214 50 188 96 154 142 C126 180 94 218 72 268 C64 288 60 308 58 326 C30 274 12 160 0 70Z" fill={`url(#dr-${side})`} stroke="#e3ded1" strokeWidth=".8" />
      <path d="M0 0 H150 C138 46 110 84 78 120 C50 152 24 190 14 232 C6 180 2 110 0 60Z" fill="#ffffff" opacity=".55" />
      <g fill="none" stroke="#d6d0c1" strokeWidth=".9" opacity=".85">
        <path d="M30 4 C34 70 40 150 52 300" />
        <path d="M70 4 C84 80 96 150 62 310" />
        <path d="M112 4 C130 70 120 130 76 250" />
        <path d="M156 4 C172 60 156 110 108 190" />
        <path d="M196 4 C204 46 184 92 150 142" />
      </g>
      <path d="M124 150 q16 -12 30 4 q-14 18 -30 -4Z" fill="#d9d3c3" opacity=".8" />
    </svg>
  );
}

/** A tall cluster of white roses that climbs the column. */
function Bunch({ side, seed, top }) {
  const b = useMemo(() => {
    const R = rng(seed);
    const leaves = Array.from({ length: 16 }, () => ({ x: 14 + R() * 92, y: 10 + R() * 175, a: R() * 360, s: 0.7 + R() * 0.7 }));
    const roses = [[60, 150, 22], [38, 118, 19], [78, 112, 20], [54, 80, 21], [30, 58, 16], [80, 56, 18], [56, 28, 17], [26, 150, 15], [90, 150, 14]]
      .map(([x, y, r], i) => ({ x: x + (R() - 0.5) * 6, y: y + (R() - 0.5) * 6, r, rot: R() * 360, i }));
    const clusters = Array.from({ length: 6 }, () => ({ x: 14 + R() * 92, y: 14 + R() * 170, r: 9 + R() * 5 }));
    const dots = Array.from({ length: 26 }, () => ({ x: 8 + R() * 104, y: 6 + R() * 184, r: 1.3 + R() * 1.4 }));
    return { leaves, roses, clusters, dots };
  }, [seed]);

  return (
    <svg className={`bunch bunch--${side}`} style={{ top }} viewBox="0 0 120 190" aria-hidden="true">
      {b.leaves.map((l, i) => <Leaf key={i} {...l} />)}
      {b.clusters.map((c, i) => <Cluster key={i} {...c} />)}
      {b.roses.map((r) => <Rose key={r.i} x={r.x} y={r.y} r={r.r} rot={r.rot} />)}
      {b.dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#fff" stroke="#d8d2c4" strokeWidth=".3" />)}
    </svg>
  );
}

function Yacht() {
  return (
    <svg className="boat" viewBox="0 0 300 120" aria-hidden="true">
      <ellipse cx="150" cy="108" rx="140" ry="7" fill="#fff" opacity=".6" />
      <path d="M10 72 H288 C282 86 270 96 252 102 H42 C26 96 16 86 10 72Z" fill="#fbfbf9" stroke="#c6cacc" />
      <path d="M13 80 H284" stroke="#a7aeb3" strokeWidth="3" />
      <path d="M58 72 L82 46 H198 L230 72Z" fill="#ffffff" stroke="#c6cacc" />
      <path d="M96 46 L110 26 H174 L190 46Z" fill="#ffffff" stroke="#c6cacc" />
      {[92, 112, 132, 152, 172, 192].map((x) => <rect key={x} x={x} y="53" width="13" height="9" rx="1.5" fill="#8e9ba5" />)}
      {[118, 138, 158].map((x) => <rect key={x} x={x} y="31" width="14" height="9" rx="1.5" fill="#8e9ba5" />)}
      <path d="M142 26 V6 M130 12 H156" stroke="#b6bcc0" strokeWidth="1.5" />
      <path d="M14 70 H284" stroke="#d2d6d8" strokeWidth="1" />
    </svg>
  );
}

export default function HeroScene() {
  return (
    <>
      <div className="sky" aria-hidden="true" />
      <div className="clouds" aria-hidden="true" />
      <div className="sea" aria-hidden="true"><i /><i /><i /></div>
      <div className="frame" aria-hidden="true">
        <Drape side="l" />
        <Drape side="r" />
        <div className="col col--l" />
        <div className="col col--r" />
        {[["18%", 5, 9], ["45%", 21, 33], ["70%", 47, 61]].map(([top, a, b]) => (
          <React.Fragment key={top}>
            <Bunch side="l" seed={a} top={top} />
            <Bunch side="r" seed={b} top={top} />
          </React.Fragment>
        ))}
        <Garland />
        <Yacht />
        <Urn className="urn--l" />
        <Urn className="urn--r" />
      </div>
    </>
  );
}
