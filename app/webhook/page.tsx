"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { createClient } from "@/lib/supabase/client";

interface WebhookLog {
  id: string;
  event_type: string | null;
  device_sn: string | null;
  status: string;
  raw_payload: any;
  created_at: string;
}

const PAGE_SIZE = 20;

const statusStyles: Record<string, string> = {
  received: "bg-blue-100/50 text-blue-700 border border-blue-200",
  processed: "bg-green-100/50 text-green-700 border border-green-200",
  failed: "bg-error-container/30 text-error border border-error/10",
};

const statusDotColors: Record<string, string> = {
  received: "bg-blue-500",
  processed: "bg-green-500",
  failed: "bg-error",
};

export default function WebhookPage() {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [filterEvent, setFilterEvent] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState({ total: 0, received: 0, processed: 0, failed: 0 });
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);
  const [cloudId, setCloudId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const supabase = createClient();

    const [settingsRes, logsRes] = await Promise.all([
      supabase.from("settings").select("key, value").eq("key", "cloud_id"),
      (async () => {
        let query = supabase
          .from("webhook_logs")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false });

        if (startDate) {
          query = query.gte("created_at", `${startDate}T00:00:00`);
        }
        if (endDate) {
          query = query.lte("created_at", `${endDate}T23:59:59`);
        }

        return query;
      })(),
    ]);

    if (!settingsRes.error && settingsRes.data) {
      setCloudId(settingsRes.data.find((s) => s.key === "cloud_id")?.value || "");
    }

    const { data, error } = await logsRes;

    if (!error && data) {
      setLogs(data);

      const received = data.filter((l) => l.status === "received").length;
      const processed = data.filter((l) => l.status === "processed").length;
      const failed = data.filter((l) => l.status === "failed").length;
      setStats({ total: data.length, received, processed, failed });
    }
    setLoading(false);
  };

  const filteredLogs = logs.filter((l) => {
    if (filterEvent !== "all" && l.event_type !== filterEvent) return false;
    if (filterStatus !== "all" && l.status !== filterStatus) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedLogs = filteredLogs.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const handleExport = () => {
    const headers = ["No", "Tanggal", "Waktu", "Cloud ID", "Jenis API", "Status", "Webhook Message"];
    const rows = filteredLogs.map((l, i) => {
      const d = new Date(l.created_at);
      return [
        i + 1,
        d.toLocaleDateString("id-ID"),
        d.toLocaleTimeString("id-ID"),
        cloudId || "-",
        l.event_type || "-",
        l.status,
        l.raw_payload
          ? typeof l.raw_payload === "string"
            ? l.raw_payload
            : JSON.stringify(l.raw_payload)
          : "-",
      ];
    });

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `webhook-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatWebhookMessage = (payload: any): string => {
    if (!payload) return "-";
    const data = typeof payload === "string" ? JSON.parse(payload) : payload;
    const type = data.type || "unknown";
    const cloudId = data.cloud_id || "";
    const transId = data.trans_id || "";
    const dataStr = data.data ? JSON.stringify(data.data) : "{}";
    return `Webhook received: {"type":"${type}","cloud_id":"${cloudId}","trans_id":${transId},"data":${dataStr}}`;
  };

  return (
    <div className="min-h-screen bg-background text-on-background">
      <Sidebar />
      <main className="ml-[68px] min-h-screen relative flex flex-col">
        <Topbar title="Riwayat Webhook" />
        <div className="p-6 lg:p-10 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary">
                Log Webhook Berjalan
              </h2>
              <p className="font-body-lg text-body-lg text-secondary max-w-2xl">
                Pantau semua aktivitas pengiriman data otomatis dari sistem ke
                endpoint URL yang telah dikonfigurasi.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-primary-container transition-all active:scale-95 shadow-lg shadow-primary/10"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Export Log
            </button>
          </div>

          <div className="glass-card rounded-xl p-4 flex flex-wrap items-center gap-6">
            <div className="flex flex-col gap-1 min-w-[200px]">
              <label className="font-label-md text-label-md text-secondary ml-1">
                Start Date
              </label>
              <input
                type="date"
                className="w-full bg-white/50 border border-outline-variant/30 rounded-lg px-4 py-2 font-body-sm text-body-sm focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              />
            </div>
            <div className="flex flex-col gap-1 min-w-[200px]">
              <label className="font-label-md text-label-md text-secondary ml-1">
                End Date
              </label>
              <input
                type="date"
                className="w-full bg-white/50 border border-outline-variant/30 rounded-lg px-4 py-2 font-body-sm text-body-sm focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              />
            </div>
            <div className="flex flex-col gap-1 min-w-[180px]">
              <label className="font-label-md text-label-md text-secondary ml-1">
                Event Type
              </label>
              <select
                className="w-full bg-white/50 border border-outline-variant/30 rounded-lg px-4 py-2 font-body-sm text-body-sm focus:ring-2 focus:ring-primary/10 focus:outline-none appearance-none cursor-pointer"
                value={filterEvent}
                onChange={(e) => { setFilterEvent(e.target.value); setPage(1); }}
              >
                <option value="all">Semua Event</option>
                <option value="get_userid_list">Get User ID List</option>
                <option value="attlog">Attendance Log</option>
                <option value="realtime_attlog">Realtime Attendance</option>
                <option value="get_attlog">Get Attendance</option>
                <option value="get_userinfo">Get User Info</option>
                <option value="set_userinfo">Set User Info</option>
                <option value="delete_userinfo">Delete User Info</option>
                <option value="set_time">Set Time</option>
                <option value="restart">Restart</option>
                <option value="register_online">Register Online</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 min-w-[150px]">
              <label className="font-label-md text-label-md text-secondary ml-1">
                Status
              </label>
              <select
                className="w-full bg-white/50 border border-outline-variant/30 rounded-lg px-4 py-2 font-body-sm text-body-sm focus:ring-2 focus:ring-primary/10 focus:outline-none appearance-none cursor-pointer"
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              >
                <option value="all">Semua Status</option>
                <option value="received">Received</option>
                <option value="processed">Processed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div className="flex-grow"></div>
            <button
              onClick={loadData}
              className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-primary-container transition-all active:scale-95 shadow-lg shadow-primary/10"
            >
              <span className="material-symbols-outlined text-sm">filter_alt</span>
              Terapkan Filter
            </button>
          </div>

          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container/30 border-b border-on-surface/[0.05]">
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider w-16">No</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Waktu</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Cloud ID</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Jenis API</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Webhook Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-on-surface/[0.05]">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-12 px-6 text-center text-secondary">
                        <span className="material-symbols-outlined animate-spin text-3xl mb-2">progress_activity</span>
                        <p className="text-[14px]">Memuat data webhook...</p>
                      </td>
                    </tr>
                  ) : paginatedLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 px-6 text-center text-secondary">
                        <span className="material-symbols-outlined text-4xl mb-2 text-outline">inbox</span>
                        <p className="text-[14px]">Tidak ada data webhook.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedLogs.map((row, idx) => {
                      const globalIdx = (safePage - 1) * PAGE_SIZE + idx;
                      const d = new Date(row.created_at);
                      return (
                        <tr key={row.id} className="hover:bg-surface-bright/50 transition-colors group">
                          <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">{globalIdx + 1}</td>
                          <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface">
                            <div className="flex flex-col">
                              <span className="text-[14px] font-bold text-primary">
                                {d.toLocaleDateString("id-ID")}
                              </span>
                              <span className="text-[12px] text-secondary">
                                {d.toLocaleTimeString("id-ID")}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">
                            {cloudId || "-"}
                          </td>
                          <td className="px-6 py-4">
                            <code className="bg-secondary-container/20 text-secondary font-mono text-[11px] px-2 py-1 rounded">
                              {row.event_type || "-"}
                            </code>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setSelectedLog(row)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all active:scale-95 text-[12px] font-semibold"
                            >
                              <span className="material-symbols-outlined text-[16px]">visibility</span>
                              Lihat
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-surface-container/10 border-t border-on-surface/[0.05] flex items-center justify-between">
              <p className="font-label-md text-label-md text-secondary">
                Menampilkan {filteredLogs.length > 0 ? `${(safePage - 1) * PAGE_SIZE + 1}-${Math.min(safePage * PAGE_SIZE, filteredLogs.length)}` : "0"} dari {filteredLogs.length} riwayat
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-secondary hover:bg-surface-variant transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
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
                      <span key={`e${idx}`} className="text-secondary px-1">...</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg font-label-md text-label-md transition-all ${
                          item === safePage
                            ? "bg-primary text-on-primary"
                            : "border border-outline-variant/30 text-secondary hover:bg-surface-variant"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-secondary hover:bg-surface-variant transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
            <div className="lg:col-span-8 glass-card rounded-xl p-6">
              <h3 className="font-title-md text-title-md text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">analytics</span>
                Ringkasan Webhook
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-surface-container-low p-4 rounded-lg text-center">
                  <p className="text-[24px] font-bold text-primary">{stats.total}</p>
                  <p className="text-[12px] text-secondary uppercase tracking-wider">Total</p>
                </div>
                <div className="bg-blue-500/10 p-4 rounded-lg text-center">
                  <p className="text-[24px] font-bold text-blue-600">{stats.received}</p>
                  <p className="text-[12px] text-secondary uppercase tracking-wider">Received</p>
                </div>
                <div className="bg-green-500/10 p-4 rounded-lg text-center">
                  <p className="text-[24px] font-bold text-green-600">{stats.processed}</p>
                  <p className="text-[12px] text-secondary uppercase tracking-wider">Processed</p>
                </div>
                <div className="bg-error/10 p-4 rounded-lg text-center">
                  <p className="text-[24px] font-bold text-error">{stats.failed}</p>
                  <p className="text-[12px] text-secondary uppercase tracking-wider">Failed</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 glass-card rounded-xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-title-md text-title-md text-primary mb-4">
                  Status Kesehatan
                </h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 flex items-center justify-center rounded-full border-4 ${stats.total > 0 && stats.failed === 0 ? "border-green-500/20 text-green-600" : stats.failed > stats.total * 0.1 ? "border-error/20 text-error" : "border-orange-500/20 text-orange-600"} font-bold text-lg`}>
                    {stats.total > 0 ? Math.round(((stats.processed + stats.received) / stats.total) * 100) : 0}%
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">
                      {stats.total > 0 && stats.failed === 0 ? "Sangat Baik" : stats.failed > stats.total * 0.1 ? "Perlu Perhatian" : "Cukup Baik"}
                    </p>
                    <p className="font-body-sm text-body-sm text-secondary">
                      {stats.processed} diproses, {stats.failed} gagal
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-lg">
                  <span className="font-body-sm text-body-sm text-on-surface">Total Diterima</span>
                  <span className="font-bold text-primary">{stats.total}</span>
                </div>
                <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-lg">
                  <span className="font-body-sm text-body-sm text-on-surface">Gagal</span>
                  <span className="font-bold text-error">{stats.failed}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Webhook Detail */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="bg-surface rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
              <h3 className="font-title-md text-title-md text-primary">Webhook Received</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="px-6 py-4 overflow-y-auto flex-1">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-lg">
                  <span className="text-[13px] text-secondary font-semibold">Timestamp</span>
                  <span className="text-[13px] font-bold text-primary">
                    {new Date(selectedLog.created_at).toLocaleDateString("id-ID")}{" "}
                    {new Date(selectedLog.created_at).toLocaleTimeString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-lg">
                  <span className="text-[13px] text-secondary font-semibold">Cloud ID</span>
                  <span className="text-[13px] font-bold text-primary">{cloudId || "-"}</span>
                </div>
                <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-lg">
                  <span className="text-[13px] text-secondary font-semibold">Jenis API</span>
                  <code className="text-[12px] font-mono bg-secondary-container/20 text-secondary px-2 py-1 rounded">
                    {selectedLog.event_type || "-"}
                  </code>
                </div>
                <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-lg">
                  <span className="text-[13px] text-secondary font-semibold">Status</span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold ${statusStyles[selectedLog.status] || statusStyles.received}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${statusDotColors[selectedLog.status] || statusDotColors.received} mr-1.5`}
                    ></span>
                    {selectedLog.status}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[13px] text-secondary font-semibold mb-2 uppercase tracking-wider">Webhook Message</p>
                <pre className="bg-surface-container-highest rounded-xl p-4 text-[12px] font-mono text-on-surface overflow-x-auto whitespace-pre-wrap max-h-[300px] overflow-y-auto border border-outline-variant/20">
                  {formatWebhookMessage(selectedLog.raw_payload)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
