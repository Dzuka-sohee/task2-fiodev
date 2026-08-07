"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { createClient } from "@/lib/supabase/client";

interface CommandLog {
  id: string;
  command: string;
  device_sn: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

const commandIcons: Record<string, string> = {
  set_time: "schedule",
  restart: "restart_alt",
  register_online: "fingerprint",
  set_userinfo: "person",
  delete_userinfo: "person_off",
};

const statusStyles: Record<string, string> = {
  success: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  pending: "bg-surface-container-highest text-secondary italic",
};

const commandLabels: Record<string, string> = {
  set_time: "Set Time",
  restart: "Restart",
  register_online: "Register Online",
  set_userinfo: "Set Userinfo",
  delete_userinfo: "Delete Userinfo",
};

export default function MesinPage() {
  const [currentTime, setCurrentTime] = useState("00:00:00");
  const [cloudId, setCloudId] = useState("");
  const [timezone, setTimezone] = useState("Asia/Jakarta");
  const [sending, setSending] = useState<"time" | "restart" | null>(null);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<CommandLog[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    function tick() {
      const now = new Date();
      const tz = timezone || "Asia/Jakarta";
      const h = String(now.toLocaleString("en-US", { hour: "2-digit", hour12: false, timeZone: tz })).padStart(2, "0");
      const m = String(now.toLocaleString("en-US", { minute: "2-digit", timeZone: tz })).padStart(2, "0");
      const s = String(now.toLocaleString("en-US", { second: "2-digit", timeZone: tz })).padStart(2, "0");
      setCurrentTime(`${h}:${m}:${s}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timezone]);

  const loadData = async () => {
    const supabase = createClient();

    const [settingsRes, historyRes] = await Promise.all([
      supabase.from("settings").select("cloud_id, device_timezone").limit(1).single(),
      supabase.from("command_logs").select("*").order("created_at", { ascending: false }).limit(20),
    ]);

    if (!settingsRes.error && settingsRes.data) {
      if (settingsRes.data.cloud_id) setCloudId(settingsRes.data.cloud_id);
      if (settingsRes.data.device_timezone) setTimezone(settingsRes.data.device_timezone);
    }
    if (!historyRes.error && historyRes.data) {
      setHistory(historyRes.data);
    }
  };

  const handleSetTime = async () => {
    setSending("time");
    setMessage("");
    try {
      const supabase = createClient();
      await supabase.from("settings").update({ device_timezone: timezone }).eq("id", (await supabase.from("settings").select("id").limit(1).single()).data?.id);

      const res = await fetch("/mesin/set-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timezone, trans_id: Date.now().toString() }),
      });
      const result = await res.json();
      if (result.success) {
        setMessage("Command set waktu dikirim. Mesin akan sinkronisasi beberapa saat.");
      } else {
        setMessage(`Gagal: ${result.message}`);
      }
    } catch {
      setMessage("Error: Gagal mengirim command.");
    }
    setSending(null);
    setTimeout(() => setMessage(""), 5000);
    loadData();
  };

  const handleRestart = async () => {
    setSending("restart");
    setMessage("");
    try {
      const res = await fetch("/mesin/restart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trans_id: Date.now().toString() }),
      });
      const result = await res.json();
      if (result.success) {
        setMessage("Command restart dikirim. Mesin akan direstart beberapa saat.");
      } else {
        setMessage(`Gagal: ${result.message}`);
      }
    } catch {
      setMessage("Error: Gagal mengirim command.");
    }
    setSending(null);
    setTimeout(() => setMessage(""), 5000);
    loadData();
  };

  const timezoneLabel: Record<string, string> = {
    "Asia/Jakarta": "GMT +07:00 (WIB)",
    "Asia/Makassar": "GMT +08:00 (WITA)",
    "Asia/Jayapura": "GMT +09:00 (WIT)",
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "transparent" }}>
      <Sidebar />
      <main className="ml-[68px] min-h-screen relative flex flex-col">
        <Topbar title="Mesin" />

        <div className="px-8 pt-6 pb-6 space-y-6">
          {message && (
            <div className={`px-4 py-3 rounded-xl text-[14px] font-medium ${
              message.includes("Gagal") || message.includes("Error")
                ? "bg-error/10 text-error"
                : "bg-green-50 text-green-700"
            }`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Info Mesin & Atur Waktu */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary">schedule</span>
                <h3 className="text-[20px] leading-[28px] font-semibold text-primary">
                  Info Mesin & Atur Waktu
                </h3>
              </div>

              <div className="space-y-2">
                <label className="text-[14px] leading-[20px] font-semibold text-outline">
                  Serial Number Mesin
                </label>
                <div className="relative">
                  <select className="w-full h-12 px-4 bg-surface-container-low border border-outline-variant rounded-xl appearance-none focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all">
                    {cloudId ? (
                      <option value={cloudId}>{cloudId}</option>
                    ) : (
                      <option>Cloud ID belum dikonfigurasi</option>
                    )}
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                  <p className="text-[10px] uppercase tracking-widest text-outline mb-1 font-bold">
                    Waktu Saat Ini
                  </p>
                  <p className="text-[48px] leading-[56px] tracking-tighter font-bold text-primary">
                    {currentTime}
                  </p>
                </div>
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                  <p className="text-[10px] uppercase tracking-widest text-outline mb-1 font-bold">
                    Zona Waktu
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-lg">
                      public
                    </span>
                    <p className="text-[16px] leading-[24px] font-bold text-primary">
                      {timezoneLabel[timezone] || timezone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <label className="text-[14px] leading-[20px] font-semibold text-outline">
                  Sesuaikan Zona Waktu
                </label>
                <div className="relative">
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full h-12 px-4 pr-10 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none"
                  >
                    <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                    <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                    <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
                </div>
              </div>

              <button
                onClick={handleSetTime}
                disabled={sending !== null || !cloudId}
                className="w-full h-12 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending === "time" ? (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined">sync</span>
                )}
                {sending === "time" ? "Mengirim..." : "Set Waktu & Sinkronisasi"}
              </button>
            </div>

            {/* Restart Mesin */}
            <div className="glass-card p-6 space-y-4 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-error">restart_alt</span>
                <h3 className="text-[20px] leading-[28px] font-semibold text-primary">
                  Restart Mesin
                </h3>
              </div>

              <div className="flex-1 space-y-4">
                <p className="text-[14px] leading-[20px] text-secondary">
                  Memulai ulang mesin akan memutuskan koneksi sementara. Pastikan tidak ada
                  aktivitas absensi saat melakukan tindakan ini.
                </p>

                <div className="space-y-2">
                  <label className="text-[14px] leading-[20px] font-semibold text-outline">
                    Pilih Mesin
                  </label>
                  <div className="relative">
                    <select className="w-full h-12 px-4 bg-surface-container-low border border-outline-variant rounded-xl appearance-none focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all">
                      {cloudId ? (
                        <option value={cloudId}>{cloudId}</option>
                      ) : (
                        <option>Cloud ID belum dikonfigurasi</option>
                      )}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                      expand_more
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-error-container/20 border border-error/10 rounded-xl flex flex-col items-center text-center gap-3">
                  <span className="material-symbols-outlined text-error text-3xl">
                    warning
                  </span>
                  <p className="text-error font-bold text-[14px] leading-[20px]">
                    Tindakan ini bersifat segera dan tidak dapat dibatalkan.
                  </p>
                  <button
                    onClick={handleRestart}
                    disabled={sending !== null || !cloudId}
                    className="w-full h-12 bg-error text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending === "restart" ? (
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>power_settings_new</span>
                    )}
                    {sending === "restart" ? "Mengirim..." : "Restart Mesin Sekarang"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* History Table */}
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-on-surface/[0.08] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">history</span>
                <h3 className="text-[20px] leading-[28px] font-semibold text-primary">
                  Riwayat Command Terbaru
                </h3>
              </div>
              <button
                onClick={loadData}
                className="px-4 py-2 border border-outline-variant rounded-full text-secondary flex items-center gap-2 hover:bg-surface-variant/30 transition-all text-[14px] leading-[20px] font-bold"
              >
                <span className="material-symbols-outlined text-lg">refresh</span>
                Refresh
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-outline uppercase text-[10px] tracking-widest font-bold">
                    <th className="px-6 py-4">No</th>
                    <th className="px-6 py-4">Waktu Execution</th>
                    <th className="px-6 py-4">Command</th>
                    <th className="px-6 py-4">Device SN</th>
                    <th className="px-6 py-4">Notes</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-on-surface/[0.05]">
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-secondary">
                        <span className="material-symbols-outlined text-4xl mb-2 text-outline">inbox</span>
                        <p className="text-[14px]">Belum ada riwayat command.</p>
                      </td>
                    </tr>
                  ) : (
                    history.map((row, idx) => (
                      <tr key={row.id} className="hover:bg-primary/5 transition-colors">
                        <td className="px-6 py-4 text-secondary font-bold">{String(idx + 1).padStart(2, "0")}</td>
                        <td className="px-6 py-4 font-bold text-on-surface">
                          {new Date(row.created_at).toLocaleString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-secondary">
                            <span className="material-symbols-outlined text-lg">
                              {commandIcons[row.command] || "terminal"}
                            </span>
                            {commandLabels[row.command] || row.command}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-secondary font-mono">
                          {row.device_sn || "-"}
                        </td>
                        <td className="px-6 py-4 text-secondary text-[13px]">
                          {row.notes || "-"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyles[row.status] || ""}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
