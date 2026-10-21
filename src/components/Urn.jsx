import React from "react";
import { Rose, FlowerDefs } from "./Flowers";

// [x, y, radius, rotation] — a domed bouquet of white roses
const ROSES = [
  [100, 92, 15, 0], [74, 100, 13, 20], [126, 100, 13, -15], [54, 110, 11, 40], [146, 110, 11, 10],
  [86, 70, 13, -10], [114, 70, 13, 25], [66, 82, 11, 5], [134, 82, 11, 30], [100, 52, 12, 15],
  [78, 50, 10, -25], [122, 50, 10, 35], [100, 32, 10, 0], [58, 96, 9, 55], [142, 96, 9, -30],
];
const LEAVES = [[44, 118, 200], [156, 118, -20], [52, 76, 235], [148, 76, -55], [70, 38, 250], [130, 38, -70], [34, 100, 185], [166, 100, -5]];
const DOTS = [[40, 84], [34, 70], [46, 56], [60, 36], [80, 22], [100, 16], [120, 22], [140, 36], [154, 56], [166, 70], [160, 84], [92, 20], [110, 24], [50, 66], [150, 66]];

/** A stone urn of white roses on a stepped pedestal. */
export default function Urn({ className = "" }) {
  return (
    <svg className={`urn ${className}`} viewBox="0 0 200 300" aria-hidden="true">
      <FlowerDefs />
      <defs>
        <linearGradient id="urn-stone" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#dcd8cf" /><stop offset=".45" stopColor="#f6f4ee" /><stop offset="1" stopColor="#cdc8bc" />
        </linearGradient>
      </defs>
      {/* pedestal */}
      <rect x="14" y="254" width="172" height="40" rx="2" fill="url(#urn-stone)" stroke="#c5c0b3" />
      <rect x="26" y="226" width="148" height="30" rx="2" fill="url(#urn-stone)" stroke="#c5c0b3" />
      <rect x="38" y="200" width="124" height="28" rx="2" fill="url(#urn-stone)" stroke="#c5c0b3" />
      {/* urn */}
      <rect x="74" y="190" width="52" height="11" rx="3" fill="url(#urn-stone)" stroke="#c5c0b3" />
      <path d="M92 190 V172 C80 164 56 152 56 120 H144 C144 152 120 164 108 172 V190Z" fill="url(#urn-stone)" stroke="#c5c0b3" />
      <path d="M60 134 C80 142 120 142 140 134 M64 146 C84 153 116 153 136 146" fill="none" stroke="#c9c4b7" strokeWidth=".9" />
      <ellipse cx="100" cy="120" rx="46" ry="8" fill="url(#urn-stone)" stroke="#c5c0b3" />
      <circle cx="53" cy="132" r="7" fill="none" stroke="#c5c0b3" strokeWidth="3" />
      <circle cx="147" cy="132" r="7" fill="none" stroke="#c5c0b3" strokeWidth="3" />
      {/* bouquet */}
      {LEAVES.map(([x, y, a], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${a})`}>
          <path d="M0 0 C8 -11 24 -11 36 0 C24 10 8 10 0 0Z" fill="url(#fl-leaf)" opacity=".92" />
        </g>
      ))}
      {DOTS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.2" fill="#fff" stroke="#d8d2c4" strokeWidth=".4" />)}
      {ROSES.map(([x, y, r, rot], i) => <Rose key={i} x={x} y={y} r={r} rot={rot} />)}
    </svg>
  );
}
