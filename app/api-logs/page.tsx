"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { createClient } from "@/lib/supabase/client";

interface LogEntry {
  id: string;
  command: string;
  device_sn: string | null;
  status: string;
  raw_payload: any;
  response: any;
  created_at: string;
  source: "api" | "webhook";
}

const PAGE_SIZE = 20;

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    success: "bg-green-500/10 text-green-600",
    received: "bg-blue-500/10 text-blue-600",
    processed: "bg-green-500/10 text-green-600",
    failed: "bg-error/10 text-error",
    pending: "bg-orange-500/10 text-orange-600",
  };

  const dotStyles: Record<string, string> = {
    success: "bg-green-500",
    received: "bg-blue-500",
    processed: "bg-green-500",
    failed: "bg-error",
    pending: "bg-orange-500 animate-pulse",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${styles[status] || styles.pending} text-[11px] font-bold uppercase tracking-wider`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[status] || dotStyles.pending}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function ApiLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [filterCommand, setFilterCommand] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0, pending: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const supabase = createClient();

    let apiQuery = supabase
      .from("api_requests")
      .select("*")
      .order("created_at", { ascending: false });

    let webhookQuery = supabase
      .from("webhook_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (startDate) {
      apiQuery = apiQuery.gte("created_at", `${startDate}T00:00:00`);
      webhookQuery = webhookQuery.gte("created_at", `${startDate}T00:00:00`);
    }
    if (endDate) {
      apiQuery = apiQuery.lte("created_at", `${endDate}T23:59:59`);
      webhookQuery = webhookQuery.lte("created_at", `${endDate}T23:59:59`);
    }

    const [apiResult, webhookResult] = await Promise.all([apiQuery, webhookQuery]);

    const apiLogs: LogEntry[] = (apiResult.data ?? []).map((r) => ({
      id: r.id,
      command: r.command,
      device_sn: r.device_sn,
      status: r.status,
      raw_payload: r.raw_payload,
      response: r.response,
      created_at: r.created_at,
      source: "api",
    }));

    const webhookLogs: LogEntry[] = (webhookResult.data ?? []).map((r) => ({
      id: r.id,
      command: r.event_type || "unknown",
      device_sn: r.device_sn,
      status: r.status,
      raw_payload: r.raw_payload,
      response: null,
      created_at: r.created_at,
      source: "webhook",
    }));

    const merged = [...apiLogs, ...webhookLogs].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    setLogs(merged);

    const success = merged.filter((l) => l.status === "success" || l.status === "processed").length;
    const failed = merged.filter((l) => l.status === "failed").length;
    const pending = merged.filter((l) => l.status === "pending" || l.status === "received").length;
    setStats({ total: merged.length, success, failed, pending });

    setLoading(false);
  };

  const filteredLogs = logs.filter((l) => {
    if (filterCommand !== "all" && l.command !== filterCommand) return false;
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
    const headers = ["No", "Tanggal", "Waktu", "Command", "Device SN", "Status", "Payload/Response"];
    const rows = filteredLogs.map((l, i) => {
      const d = new Date(l.created_at);
      const displayData = l.source === "webhook"
        ? l.raw_payload
        : (l.response || l.raw_payload);
      const dataStr = displayData
        ? typeof displayData === "string"
          ? displayData
          : JSON.stringify(displayData)
        : "-";
      return [
        i + 1,
        d.toLocaleDateString("id-ID"),
        d.toLocaleTimeString("id-ID"),
        l.command,
        l.device_sn || "-",
        l.status,
        dataStr,
      ];
    });

    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `api-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "transparent" }}>
      <Sidebar />
      <main className="ml-[68px] min-h-screen relative flex flex-col">
        <Topbar title="Riwayat Request API" />
        <div className="p-6 lg:p-10 flex flex-col gap-6">
          {/* Header Section */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-[32px] leading-10 tracking-tight font-semibold text-primary">
                Riwayat Request API
              </h1>
              <p className="text-[16px] leading-6 text-secondary">
                Monitoring system logs, API requests, dan webhook data.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="bg-primary text-white px-6 py-2.5 rounded-xl text-[16px] flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/10"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
              Export Log
            </button>
          </section>

          {/* Filter Bar */}
          <section className="glass-card p-6 rounded-xl flex flex-wrap items-center gap-6">
            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
              <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider">
                Start Date
              </label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] focus:border-primary/30 focus:ring-0 transition-all cursor-pointer"
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
              <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider">
                End Date
              </label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] focus:border-primary/30 focus:ring-0 transition-all cursor-pointer"
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
              <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider">
                Command Type
              </label>
              <select
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] focus:border-primary/30 focus:ring-0 transition-all appearance-none cursor-pointer"
                value={filterCommand}
                onChange={(e) => { setFilterCommand(e.target.value); setPage(1); }}
              >
                <option value="all">All Commands</option>
                <option value="get_all_pin">Get All PIN</option>
                <option value="get_attlog">Get Attendance Log</option>
                <option value="get_userinfo">Get User Info</option>
                <option value="set_userinfo">Set User Info</option>
                <option value="delete_userinfo">Delete User Info</option>
                <option value="set_time">Set Time</option>
                <option value="restart">Restart</option>
                <option value="register_online">Register Online</option>
                <option value="attlog">Attlog (Webhook)</option>
                <option value="get_userid_list">Get User ID List</option>
                <option value="realtime_attlog">Realtime Attendance</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
              <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider">
                Status
              </label>
              <select
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] focus:border-primary/30 focus:ring-0 transition-all appearance-none cursor-pointer"
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="received">Received</option>
                <option value="processed">Processed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div className="flex items-end h-full mt-auto">
              <button
                onClick={loadData}
                className="bg-surface-variant hover:bg-outline-variant/30 text-primary p-2.5 rounded-xl transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>
          </section>

          {/* Data Table */}
          <section className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-surface-container-high/40 text-secondary border-b border-outline-variant/20">
                    <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest w-16">No</th>
                    <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest">Waktu</th>
                    <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest">Command</th>
                    <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest">Device SN</th>
                    <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest">Payload / Response</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 px-6 text-center text-secondary">
                        <span className="material-symbols-outlined animate-spin text-3xl mb-2">progress_activity</span>
                        <p className="text-[14px]">Memuat data...</p>
                      </td>
                    </tr>
                  ) : paginatedLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 px-6 text-center text-secondary">
                        <span className="material-symbols-outlined text-4xl mb-2 text-outline">inbox</span>
                        <p className="text-[14px]">Tidak ada data API log.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedLogs.map((row, idx) => {
                      const globalIdx = (safePage - 1) * PAGE_SIZE + idx;
                      const d = new Date(row.created_at);
                      const displayData = row.source === "webhook"
                        ? row.raw_payload
                        : (row.response || row.raw_payload);
                      const formattedJson = displayData
                        ? typeof displayData === "string"
                          ? displayData
                          : JSON.stringify(displayData, null, 2)
                        : null;
                      return (
                        <tr key={`${row.source}-${row.id}`} className="hover:bg-primary/[0.02] transition-colors">
                          <td className="px-6 py-4 text-[14px]">{globalIdx + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-[14px] font-bold text-primary">
                                {d.toLocaleDateString("id-ID")}
                              </span>
                              <span className="text-[12px] text-secondary">
                                {d.toLocaleTimeString("id-ID")}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <code className="px-2 py-1 bg-surface-container-highest rounded text-[12px] font-mono text-secondary">
                              {row.command}
                            </code>
                          </td>
                          <td className="px-6 py-4 text-[14px] font-medium text-secondary">
                            {row.device_sn || "-"}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={row.status} />
                          </td>
                          <td className="px-6 py-4">
                            {formattedJson ? (
                              <pre className="px-3 py-2 bg-surface-container-highest rounded-lg text-[11px] font-mono text-secondary max-w-[280px] overflow-x-auto whitespace-pre-wrap">
                                {formattedJson}
                              </pre>
                            ) : (
                              <span className="text-[13px] text-outline">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between">
              <p className="text-[14px] text-secondary">
                Showing <span className="font-bold text-primary">{filteredLogs.length > 0 ? (safePage - 1) * PAGE_SIZE + 1 : 0}-{Math.min(safePage * PAGE_SIZE, filteredLogs.length)}</span> of{" "}
                <span className="font-bold text-primary">{filteredLogs.length}</span> entries
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-secondary hover:bg-surface-container transition-all disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
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
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-[14px] font-bold transition-all ${
                          item === safePage
                            ? "bg-primary text-white"
                            : "border border-outline-variant/30 text-secondary hover:bg-surface-container"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-secondary hover:bg-surface-container transition-all disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </section>

          {/* Stats Row */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600">check_circle</span>
              </div>
              <div>
                <h4 className="text-[12px] font-semibold text-secondary uppercase tracking-widest">Total Success</h4>
                <p className="text-[20px] font-bold text-primary">{stats.success}</p>
              </div>
            </div>
            <div className="glass-card p-6 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-error">error</span>
              </div>
              <div>
                <h4 className="text-[12px] font-semibold text-secondary uppercase tracking-widest">Total Failed</h4>
                <p className="text-[20px] font-bold text-primary">{stats.failed}</p>
              </div>
            </div>
            <div className="glass-card p-6 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-orange-600">pending</span>
              </div>
              <div>
                <h4 className="text-[12px] font-semibold text-secondary uppercase tracking-widest">Pending / Received</h4>
                <p className="text-[20px] font-bold text-primary">{stats.pending}</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
