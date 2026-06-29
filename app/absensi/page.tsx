"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { createClient } from "@/lib/supabase/client";
import { formatVerifyType } from "@/lib/utils";

interface AttLog {
  id: string;
  pin: string;
  user_name: string | null;
  scan_time: string;
  verify_type: number | null;
  status_code: number | null;
  device_sn: string | null;
  created_at: string;
}

const PAGE_SIZE = 20;

const verifyIcons: Record<number, string> = {
  0: "fingerprint",
  1: "pin",
  2: "credit_card",
  12: "face",
  13: "visibility",
  15: "face",
};

function getStatusLabel(code: number | null): string {
  if (code === 0) return "Success";
  if (code === 1) return "Failed";
  if (code === 2) return "Error";
  return "Unknown";
}

function getStatusStyle(code: number | null): string {
  if (code === 0) return "bg-green-500/10 text-green-700 border border-green-500/20";
  if (code === 1) return "bg-amber-500/10 text-amber-700 border border-amber-500/20";
  return "bg-error/10 text-error border border-error/20";
}

const avatarColors = [
  { bg: "bg-secondary-container", text: "text-secondary" },
  { bg: "bg-tertiary-fixed-dim", text: "text-tertiary" },
  { bg: "bg-primary-fixed-dim", text: "text-primary" },
  { bg: "bg-surface-container-highest", text: "text-on-surface-variant" },
  { bg: "bg-secondary-fixed", text: "text-on-secondary-fixed" },
];

function getInitials(name: string | null, pin: string): string {
  if (name) {
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  }
  return pin.slice(-2);
}

export default function AbsensiPage() {
  const [logs, setLogs] = useState<AttLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const endDateDefault = new Date().toISOString().split("T")[0];
  const [endDate, setEndDate] = useState(endDateDefault);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const supabase = createClient();

    const [attRes, userRes] = await Promise.all([
      (() => {
        let q = supabase
          .from("attlogs")
          .select("*", { count: "exact" })
          .order("scan_time", { ascending: false });
        if (startDate) q = q.gte("scan_time", `${startDate}T00:00:00`);
        if (endDate) q = q.lte("scan_time", `${endDate}T23:59:59`);
        return q;
      })(),
      supabase.from("userinfos").select("pin, name"),
    ]);

    if (!attRes.error && attRes.data) {
      const userNameMap = new Map<string, string>();
      if (!userRes.error && userRes.data) {
        for (const u of userRes.data) {
          if (u.pin && u.name) userNameMap.set(u.pin, u.name);
        }
      }

      const merged = attRes.data.map((log) => ({
        ...log,
        user_name: log.user_name || userNameMap.get(log.pin) || null,
      }));

      setLogs(merged);
    }
    setLoading(false);
  };

  const filteredLogs = logs.filter(
    (l) =>
      l.pin.includes(search) ||
      l.user_name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedLogs = filteredLogs.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const handleExportCSV = () => {
    const headers = ["No", "PIN", "Nama", "Waktu Scan", "Tipe Verifikasi", "Status", "Device SN"];
    const rows = filteredLogs.map((l, i) => {
      const vType = l.verify_type ?? 0;
      return [
        i + 1,
        l.pin,
        l.user_name || "-",
        new Date(l.scan_time).toLocaleString("id-ID"),
        formatVerifyType(vType),
        getStatusLabel(l.status_code),
        l.device_sn || "-",
      ];
    });

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `absensi-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-[68px] min-h-screen relative flex flex-col">
        <Topbar title="Data Absensi" />
        <div className="p-6 lg:p-10 flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[32px] leading-[40px] tracking-[-0.01em] font-semibold text-primary">Attendance Logs</h2>
              <p className="text-secondary text-[14px] mt-1">Real-time monitoring of personnel movements and clock-in events.</p>
            </div>
            <div className="hidden lg:flex items-center">
              <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[12px] font-semibold text-secondary uppercase tracking-wider">System Online</span>
              </div>
            </div>
          </div>

          <section className="glass-card p-6 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
              <div className="lg:col-span-2 flex flex-col gap-2">
                <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider ml-1">Start Date</label>
                <input
                  className="w-full bg-surface-container/50 border border-on-surface/[0.08] rounded-xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all"
                  type="date"
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                />
              </div>
              <div className="lg:col-span-2 flex flex-col gap-2">
                <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider ml-1">End Date</label>
                <input
                  className="w-full bg-surface-container/50 border border-on-surface/[0.08] rounded-xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all"
                  type="date"
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                />
              </div>
              <div className="lg:col-span-4 flex flex-col gap-2">
                <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider ml-1">Search User</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
                  <input
                    className="w-full bg-surface-container/50 border border-on-surface/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-[14px] focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all"
                    placeholder="PIN or Name..."
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  />
                </div>
              </div>
              <div className="lg:col-span-4 flex gap-4">
                <button
                  onClick={loadData}
                  disabled={loading}
                  className="flex-1 glass-card bg-transparent hover:bg-surface-variant/30 text-primary font-bold py-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 border border-on-surface/[0.08] disabled:opacity-50"
                >
                  {loading ? (
                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-lg">download</span>
                  )}
                  {loading ? "Mengambil..." : "Ambil Data"}
                </button>
                <button
                  onClick={handleExportCSV}
                  disabled={filteredLogs.length === 0}
                  className="flex-1 bg-primary text-white font-bold py-2.5 rounded-xl transition-all hover:bg-primary-container active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary/10 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-lg">download</span>
                  Export CSV
                </button>
              </div>
            </div>
          </section>

          <section className="flex-1 glass-card rounded-2xl overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container/30 border-b border-on-surface/[0.08]">
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">No</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">PIN</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Nama Personnel</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Waktu Scan</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Tipe Verifikasi</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-on-surface/[0.04]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 px-6 text-center text-secondary">
                        <span className="material-symbols-outlined animate-spin text-3xl mb-2">progress_activity</span>
                        <p className="text-[14px]">Memuat data absensi...</p>
                      </td>
                    </tr>
                  ) : paginatedLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 px-6 text-center text-secondary">
                        <span className="material-symbols-outlined text-4xl mb-2 text-outline">inbox</span>
                        <p className="text-[14px]">
                          {logs.length === 0
                            ? "Belum ada data absensi. Klik \"Ambil Data\" untuk memuat."
                            : "Data tidak ditemukan."}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedLogs.map((row, idx) => {
                      const globalIdx = (safePage - 1) * PAGE_SIZE + idx;
                      const color = avatarColors[globalIdx % avatarColors.length];
                      const vType = row.verify_type ?? 0;
                      return (
                        <tr key={row.id} className="hover:bg-surface-variant/20 transition-colors">
                          <td className="py-4 px-6 text-[14px] font-medium">{globalIdx + 1}</td>
                          <td className="py-4 px-6 font-mono text-[14px] text-primary">{row.pin}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full ${color.bg} flex items-center justify-center ${color.text} text-xs font-bold`}>
                                {getInitials(row.user_name, row.pin)}
                              </div>
                              <span className="text-[14px] font-bold text-primary">{row.user_name || "-"}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-[14px] text-secondary">
                            {new Date(row.scan_time).toLocaleString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 text-[14px] text-secondary">
                              <span className="material-symbols-outlined text-sm">{verifyIcons[vType] || "help"}</span>
                              {formatVerifyType(vType)}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${getStatusStyle(row.status_code)}`}>
                              {getStatusLabel(row.status_code)}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-auto border-t border-on-surface/[0.08] px-6 py-4 flex items-center justify-between">
              <p className="text-[14px] text-secondary">
                {filteredLogs.length > 0 ? (
                  <>Menampilkan <span className="font-bold text-primary">{(safePage - 1) * PAGE_SIZE + 1} - {Math.min(safePage * PAGE_SIZE, filteredLogs.length)}</span> dari <span className="font-bold text-primary">{filteredLogs.length}</span> records</>
                ) : (
                  "Tidak ada data"
                )}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-on-surface/[0.08] text-secondary hover:bg-surface-variant/50 transition-colors disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 2)
                  .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("ellipsis");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "ellipsis" ? (
                      <span key={`e${idx}`} className="text-secondary mx-1">...</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs transition-colors ${
                          item === safePage
                            ? "bg-primary text-white"
                            : "border border-on-surface/[0.08] text-secondary hover:bg-surface-variant/50"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-on-surface/[0.08] text-secondary hover:bg-surface-variant/50 transition-colors disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
