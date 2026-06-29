"use client";

import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

interface DashboardData {
  metrics: {
    attendanceToday: number;
    totalEmployees: number;
    apiRequestsToday: number;
    webhookReceived: number;
  };
  attendanceTrend: { date: string; count: number }[];
  recentLogs: {
    id: string;
    pin: string;
    user_name: string;
    scan_time: string;
    verify_type: number;
    status_code: number;
    device_sn: string;
  }[];
  topPerformers: { pin: string; name: string; count: number }[];
  weeklyComparison: { day: string; count: number }[];
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getStatusLabel(code: number) {
  if (code === 0) return { label: "Present", color: "bg-green-100 text-green-700" };
  if (code === 1) return { label: "Late", color: "bg-yellow-100 text-yellow-700" };
  return { label: "On Duty", color: "bg-blue-100 text-blue-700" };
}

function getMedalColor(index: number) {
  if (index === 0) return { bg: "bg-yellow-400", ring: "bg-yellow-400", icon: "text-yellow-500" };
  if (index === 1) return { bg: "bg-slate-400", ring: "bg-slate-300", icon: "text-slate-400" };
  return { bg: "bg-orange-400", ring: "bg-orange-300", icon: "text-orange-400" };
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const m = data?.metrics ?? { attendanceToday: 0, totalEmployees: 0, apiRequestsToday: 0, webhookReceived: 0 };
  const trend = data?.attendanceTrend ?? [];
  const logs = data?.recentLogs ?? [];
  const performers = data?.topPerformers ?? [];
  const weekly = data?.weeklyComparison ?? [];
  const maxWeekly = Math.max(...weekly.map((w) => w.count), 1);

  const maxTrend = Math.max(...trend.map((t) => t.count), 1);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-[68px] min-h-screen">
        <Topbar title="Dashboard" />
        <div className="p-6 lg:p-10 space-y-6">
          {/* Row 1: Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Kehadiran Hari Ini */}
            <div className="glass-card p-6 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <span className="material-symbols-outlined">person_check</span>
                </div>
              </div>
              <h3 className="text-secondary text-xs uppercase tracking-wider font-semibold">Kehadiran Hari Ini</h3>
              <p className="text-[48px] leading-[56px] tracking-[-0.02em] font-bold text-primary mt-1">
                {loading ? "—" : m.attendanceToday.toLocaleString("id-ID")}
              </p>
              <div className="mt-4 h-12 w-full flex items-end gap-1">
                {trend.slice(-6).map((t, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary/40 rounded-t-sm transition-all"
                    style={{ height: `${Math.max((t.count / maxTrend) * 100, 5)}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Total Karyawan */}
            <div className="glass-card p-6 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-secondary-container/30 text-on-secondary-container rounded-lg">
                  <span className="material-symbols-outlined">groups</span>
                </div>
                <span className="text-[12px] font-semibold text-secondary">Total</span>
              </div>
              <h3 className="text-secondary text-xs uppercase tracking-wider font-semibold">Total Karyawan</h3>
              <p className="text-[48px] leading-[56px] tracking-[-0.02em] font-bold text-primary mt-1">
                {loading ? "—" : m.totalEmployees.toLocaleString("id-ID")}
              </p>
              <div className="mt-4 h-12 flex items-center">
                <div className="w-full bg-surface-variant/50 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: `${m.totalEmployees > 0 ? 95 : 0}%` }} />
                </div>
              </div>
            </div>

            {/* Request API Hari Ini */}
            <div className="glass-card p-6 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-tertiary-fixed/30 text-on-tertiary-fixed-variant rounded-lg">
                  <span className="material-symbols-outlined">api</span>
                </div>
              </div>
              <h3 className="text-secondary text-xs uppercase tracking-wider font-semibold">Request API Hari Ini</h3>
              <p className="text-[48px] leading-[56px] tracking-[-0.02em] font-bold text-primary mt-1">
                {loading ? "—" : m.apiRequestsToday.toLocaleString("id-ID")}
              </p>
              <div className="mt-4 h-12 w-full flex items-end gap-1">
                {trend.slice(-6).map((t, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-tertiary-fixed/60 rounded-t-sm transition-all"
                    style={{ height: `${Math.max((t.count / maxTrend) * 100, 5)}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Webhook Diterima */}
            <div className="glass-card p-6 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-outline-variant/30 text-secondary rounded-lg">
                  <span className="material-symbols-outlined">webhook</span>
                </div>
                <span className="text-[12px] font-semibold text-green-600">Stable</span>
              </div>
              <h3 className="text-secondary text-xs uppercase tracking-wider font-semibold">Webhook Diterima</h3>
              <p className="text-[48px] leading-[56px] tracking-[-0.02em] font-bold text-primary mt-1">
                {loading ? "—" : m.webhookReceived.toLocaleString("id-ID")}
              </p>
              <div className="mt-4 h-12 flex items-center justify-center gap-2">
                <div className="animate-pulse w-3 h-3 rounded-full bg-green-500" />
                <span className="text-[12px] font-semibold text-secondary">Real-time sync active</span>
              </div>
            </div>
          </div>

          {/* Row 2: Chart + Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Attendance Trend */}
            <div className="lg:col-span-8 glass-card p-6 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-[20px] leading-[28px] font-semibold text-primary">Attendance Trend</h3>
                  <p className="text-secondary text-sm">30 hari terakhir</p>
                </div>
              </div>
              <div className="h-64 w-full relative">
                {trend.length > 0 ? (
                  <svg className="w-full h-full" viewBox={`0 0 ${trend.length * 26} 200`} preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#1d2b3e" stopOpacity="1" />
                        <stop offset="100%" stopColor="#1d2b3e" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M${trend.map((t, i) => `${i * 26},${200 - (t.count / maxTrend) * 180}`).join(" L")}`}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="stroke-primary fill-none stroke-[3]"
                    />
                    <path
                      d={`M${trend.map((t, i) => `${i * 26},${200 - (t.count / maxTrend) * 180}`).join(" L")} L${(trend.length - 1) * 26},200 L0,200 Z`}
                      fill="url(#grad1)"
                      opacity="0.1"
                    />
                    {trend.map((t, i) => (
                      <circle
                        key={i}
                        cx={i * 26}
                        cy={200 - (t.count / maxTrend) * 180}
                        r="3"
                        className="fill-primary"
                      />
                    ))}
                  </svg>
                ) : (
                  <div className="h-full flex items-center justify-center text-secondary">
                    {loading ? "Memuat data..." : "Belum ada data absensi"}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 w-full flex justify-between px-4 text-[12px] font-semibold text-secondary/60">
                  {trend.length > 0 ? (
                    <>
                      <span>{new Date(trend[0].date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                      <span>{new Date(trend[Math.floor(trend.length / 2)].date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                      <span>{new Date(trend[trend.length - 1].date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                    </>
                  ) : (
                    <>
                      <span>—</span>
                      <span>—</span>
                      <span>—</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Top Performers */}
            <div className="lg:col-span-4 glass-card p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-tertiary-container">emoji_events</span>
                <h3 className="text-[20px] leading-[28px] font-semibold text-primary">Top Performers</h3>
              </div>
              <div className="space-y-4">
                {performers.length > 0 ? (
                  performers.map((p, i) => {
                    const medal = getMedalColor(i);
                    return (
                      <div
                        key={p.pin}
                        className={`flex items-center gap-4 p-2 rounded-lg ${
                          i === 0 ? "bg-tertiary-fixed/10 border border-tertiary-fixed/20" : "hover:bg-surface-variant/30"
                        } transition-colors`}
                      >
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full ${medal.bg} flex items-center justify-center text-white font-bold text-sm`}>
                            {getInitials(p.name)}
                          </div>
                          <div className={`absolute -top-1 -right-1 w-5 h-5 ${medal.ring} rounded-full flex items-center justify-center text-[10px] text-white font-bold border-2 border-surface`}>
                            {i + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-primary">{p.name}</p>
                          <p className="text-[12px] font-semibold text-secondary">{p.count} scan</p>
                        </div>
                        <span className={`material-symbols-outlined ${medal.icon}`} style={i === 0 ? { fontVariationSettings: "'FILL' 1" } : {}}>
                          {i === 0 ? "workspace_premium" : "military_tech"}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-secondary py-8">
                    {loading ? "Memuat..." : "Belum ada data"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 3: Bar Chart + Logs Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Weekly Comparison Bar Chart */}
            <div className="lg:col-span-5 glass-card p-6 rounded-xl">
              <h3 className="text-[20px] leading-[28px] font-semibold text-primary mb-6">Weekly Comparison</h3>
              <div className="h-64 flex items-end justify-between px-4 pb-4">
                {weekly.map((w, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-8 rounded-t-md transition-all ${w.count > 0 ? "bg-primary" : "bg-outline-variant"}`}
                      style={{ height: `${Math.max((w.count / maxWeekly) * 200, w.count > 0 ? 16 : 8)}px` }}
                    />
                    <span className="text-[12px] font-semibold text-secondary">{w.day}</span>
                    <span className="text-[10px] font-bold text-primary">{w.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Logs Table */}
            <div className="lg:col-span-7 glass-card p-6 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[20px] leading-[28px] font-semibold text-primary">Recent Logs</h3>
                <a href="/absensi" className="text-[12px] font-bold text-primary flex items-center gap-1">
                  View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[12px] font-semibold text-secondary border-b border-outline-variant/20 uppercase tracking-widest">
                      <th className="pb-4 font-bold">Employee</th>
                      <th className="pb-4 font-bold">Scan Time</th>
                      <th className="pb-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {logs.length > 0 ? (
                      logs.map((log) => {
                        const status = getStatusLabel(log.status_code);
                        return (
                          <tr key={log.id} className="border-b border-outline-variant/10 group hover:bg-surface-variant/20 transition-colors">
                            <td className="py-4 flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                {getInitials(log.user_name || log.pin)}
                              </div>
                              <span className="font-bold text-primary">{log.user_name || log.pin}</span>
                            </td>
                            <td className="py-4 text-secondary">{formatTime(log.scan_time)}</td>
                            <td className="py-4">
                              <span className={`${status.color} px-2 py-1 rounded-full text-xs font-bold`}>{status.label}</span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-secondary">
                          {loading ? "Memuat data..." : "Belum ada log absensi"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
