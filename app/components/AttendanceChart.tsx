"use client";

import { useEffect, useState } from "react";

interface Props {
  data: { date: string; hadir: number; tidakHadir: number }[];
  loading?: boolean;
}

function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    const t = 0.3;
    d += ` C${p1.x + (p2.x - p0.x) * t},${p1.y + (p2.y - p0.y) * t} ${p2.x - (p3.x - p1.x) * t},${p2.y - (p3.y - p1.y) * t} ${p2.x},${p2.y}`;
  }
  return d;
}

function fmtDate(s: string) {
  const p = s.split("-");
  if (p.length !== 3) return "—";
  const d = new Date(+p[0], +p[1] - 1, +p[2]);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export default function AttendanceChart({ data, loading }: Props) {
  const [vis, setVis] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setVis(true), 100);
    return () => clearTimeout(t);
  }, []);

  const trend = data ?? [];

  if (trend.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-secondary text-sm">
        {loading ? "Memuat data..." : "Belum ada data absensi"}
      </div>
    );
  }

  const maxVal = Math.max(...trend.map((t) => Math.max(t.hadir, t.tidakHadir)), 1);

  const W = 700, H = 250;
  const pad = { t: 25, r: 20, b: 35, l: 45 };
  const cW = W - pad.l - pad.r, cH = H - pad.t - pad.b;
  const toX = (i: number) => pad.l + (trend.length > 1 ? (i / (trend.length - 1)) * cW : cW / 2);
  const toY = (v: number) => pad.t + cH - (v / maxVal) * cH;

  const hPts = trend.map((t, i) => ({ x: toX(i), y: toY(t.hadir) }));
  const tPts = trend.map((t, i) => ({ x: toX(i), y: toY(t.tidakHadir) }));
  const hPath = smoothPath(hPts);
  const tPath = smoothPath(tPts);
  const bottom = pad.t + cH;

  const yVals = Array.from({ length: 6 }, (_, i) => Math.round((maxVal / 5) * i));

  const xIdxs = Array.from(new Set([0, Math.floor((trend.length - 1) / 4), Math.floor((trend.length - 1) / 2), Math.floor(((trend.length - 1) * 3) / 4), trend.length - 1]))
    .sort((a, b) => a - b);

  return (
    <div className="w-full h-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="gH" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.01" />
          </linearGradient>
          <linearGradient id="gT" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.01" />
          </linearGradient>
          <filter id="ds"><feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.1" /></filter>
        </defs>

        {yVals.map((v, i) => (
          <g key={`y${i}`}>
            <line x1={pad.l} y1={toY(v)} x2={W - pad.r} y2={toY(v)} stroke="#e5e7eb" strokeWidth="1" strokeDasharray={i === 0 ? "0" : "4,4"} opacity={vis ? 0.5 : 0} style={{ transition: `opacity 0.5s ease ${i * 60}ms` }} />
            <text x={pad.l - 8} y={toY(v) + 4} textAnchor="end" fill="#6b7280" fontSize="11" fontFamily="inherit" opacity={vis ? 1 : 0} style={{ transition: `opacity 0.5s ease ${i * 60 + 150}ms` }}>{v}</text>
          </g>
        ))}

        {xIdxs.map((idx) => (
          <text key={`x${idx}`} x={toX(idx)} y={H - 8} textAnchor="middle" fill="#6b7280" fontSize="10" fontFamily="inherit" opacity={vis ? 0.7 : 0} style={{ transition: "opacity 0.5s ease 0.4s" }}>{fmtDate(trend[idx].date)}</text>
        ))}

        <path d={`${hPath} L${hPts[hPts.length - 1].x},${bottom} L${hPts[0].x},${bottom} Z`} fill="url(#gH)" opacity={vis ? 1 : 0} style={{ transition: "opacity 1s ease 0.3s" }} />
        <path d={`${tPath} L${tPts[tPts.length - 1].x},${bottom} L${tPts[0].x},${bottom} Z`} fill="url(#gT)" opacity={vis ? 1 : 0} style={{ transition: "opacity 1s ease 0.3s" }} />

        <path d={hPath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 3000, strokeDashoffset: vis ? 0 : 3000, transition: "stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)" }} />
        <path d={tPath} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 3000, strokeDashoffset: vis ? 0 : 3000, transition: "stroke-dashoffset 2s cubic-bezier(0.4,0,0.2,1) 0.15s" }} />

        {hPts.map((p, i) => (
          <g key={`h${i}`}>
            <circle cx={p.x} cy={p.y} r="14" fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }} />
            {hover === i && <circle cx={p.x} cy={p.y} r="9" fill="none" stroke="#2563eb" strokeWidth="1.5" opacity="0.25" />}
            <circle cx={p.x} cy={p.y} r={hover === i ? 5 : 3.5} fill="#fff" stroke="#2563eb" strokeWidth="2" filter="url(#ds)" opacity={vis ? 1 : 0} style={{ transition: "opacity 0.4s ease, r 0.2s ease", transitionDelay: `${0.9 + i * 0.04}s` }} />
          </g>
        ))}
        {tPts.map((p, i) => (
          <g key={`t${i}`}>
            <circle cx={p.x} cy={p.y} r="14" fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }} />
            {hover === i && <circle cx={p.x} cy={p.y} r="9" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.25" />}
            <circle cx={p.x} cy={p.y} r={hover === i ? 5 : 3.5} fill="#fff" stroke="#ef4444" strokeWidth="2" filter="url(#ds)" opacity={vis ? 1 : 0} style={{ transition: "opacity 0.4s ease, r 0.2s ease", transitionDelay: `${0.95 + i * 0.04}s` }} />
          </g>
        ))}

        {hover !== null && trend[hover] && (
          <g>
            <rect x={toX(hover) - 50} y={pad.t - 10} width="100" height="52" rx="8" fill="white" stroke="#e5e7eb" strokeWidth="1" />
            <text x={toX(hover) - 38} y={pad.t + 12} fill="#2563eb" fontSize="11" fontWeight="600" fontFamily="inherit">● {trend[hover].hadir}</text>
            <text x={toX(hover) - 38} y={pad.t + 30} fill="#ef4444" fontSize="11" fontWeight="600" fontFamily="inherit">● {trend[hover].tidakHadir}</text>
            <text x={toX(hover) + 20} y={pad.t + 22} fill="#9ca3af" fontSize="9" fontFamily="inherit">{fmtDate(trend[hover].date)}</text>
          </g>
        )}

        <circle cx={W - pad.r - 120} cy="12" r="4" fill="#2563eb" />
        <text x={W - pad.r - 112} y="16" fill="#6b7280" fontSize="11" fontFamily="inherit">Hadir</text>
        <circle cx={W - pad.r - 60} cy="12" r="4" fill="#ef4444" />
        <text x={W - pad.r - 52} y="16" fill="#6b7280" fontSize="11" fontFamily="inherit">Tidak Hadir</text>
      </svg>
    </div>
  );
}
