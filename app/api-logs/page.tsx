import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const apiLogsData = [
  {
    no: "01",
    date: "31 Oct 2023",
    time: "09:45:22 AM",
    command: "get_user_info",
    serialNumber: "FS2023-99412",
    status: "success" as const,
  },
  {
    no: "02",
    date: "31 Oct 2023",
    time: "09:42:10 AM",
    command: "sync_attendance",
    serialNumber: "FS2023-88210",
    status: "failed" as const,
  },
  {
    no: "03",
    date: "31 Oct 2023",
    time: "09:38:05 AM",
    command: "clear_logs",
    serialNumber: "FS2023-77543",
    status: "pending" as const,
  },
  {
    no: "04",
    date: "31 Oct 2023",
    time: "09:15:33 AM",
    command: "set_time",
    serialNumber: "FS2023-22109",
    status: "success" as const,
  },
  {
    no: "05",
    date: "31 Oct 2023",
    time: "09:02:11 AM",
    command: "get_user_info",
    serialNumber: "FS2023-99412",
    status: "success" as const,
  },
];

function StatusBadge({ status }: { status: "success" | "failed" | "pending" }) {
  const styles = {
    success: "bg-green-500/10 text-green-600",
    failed: "bg-error/10 text-error",
    pending: "bg-orange-500/10 text-orange-600",
  };

  const dotStyles = {
    success: "bg-green-500",
    failed: "bg-error",
    pending: "bg-orange-500 animate-pulse",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${styles[status]} text-[11px] font-bold uppercase tracking-wider`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[status]}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function ApiLogsPage() {
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
                Monitoring system logs and real-time API transactions.
              </p>
            </div>
            <button className="bg-primary text-white px-6 py-2.5 rounded-xl text-[16px] flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/10">
              <span className="material-symbols-outlined text-[20px]">download</span>
              Export Log
            </button>
          </section>

          {/* Filter Bar */}
          <section className="glass-card p-6 rounded-xl flex flex-wrap items-center gap-6">
            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
              <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider">
                Date Range
              </label>
              <div className="relative">
                <input
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] focus:border-primary/30 focus:ring-0 transition-all cursor-pointer"
                  type="text"
                  defaultValue="Oct 24, 2023 - Oct 31, 2023"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
                  calendar_month
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
              <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider">
                Command Type
              </label>
              <select className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] focus:border-primary/30 focus:ring-0 transition-all appearance-none cursor-pointer">
                <option>All Commands</option>
                <option>Get User Info</option>
                <option>Set User Info</option>
                <option>Get Attendance Log</option>
                <option>Clear Attendance Log</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
              <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider">
                Status
              </label>
              <select className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[14px] focus:border-primary/30 focus:ring-0 transition-all appearance-none cursor-pointer">
                <option>All Status</option>
                <option>Success</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>
            </div>
            <div className="flex items-end h-full mt-auto">
              <button className="bg-surface-variant hover:bg-outline-variant/30 text-primary p-2.5 rounded-xl transition-all active:scale-95">
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
                    <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest w-16">
                      No
                    </th>
                    <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest">
                      Waktu
                    </th>
                    <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest">
                      Command
                    </th>
                    <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest">
                      Serial Number
                    </th>
                    <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {apiLogsData.map((row) => (
                    <tr
                      key={row.no}
                      className="hover:bg-primary/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 text-[14px]">{row.no}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-primary">
                            {row.date}
                          </span>
                          <span className="text-[12px] text-secondary">
                            {row.time}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="px-2 py-1 bg-surface-container-highest rounded text-[12px] font-mono text-secondary">
                          {row.command}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-[14px] font-medium text-secondary">
                        {row.serialNumber}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="p-2 rounded-lg hover:bg-surface-container transition-colors text-secondary hover:text-primary">
                          <span className="material-symbols-outlined text-[20px]">
                            visibility
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between">
              <p className="text-[14px] text-secondary">
                Showing <span className="font-bold text-primary">1-5</span> of{" "}
                <span className="font-bold text-primary">128</span> entries
              </p>
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-secondary hover:bg-surface-container transition-all">
                  <span className="material-symbols-outlined text-[18px]">
                    chevron_left
                  </span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white text-[14px] font-bold">
                  1
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-secondary hover:bg-surface-container transition-all text-[14px]">
                  2
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-secondary hover:bg-surface-container transition-all text-[14px]">
                  3
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-secondary hover:bg-surface-container transition-all">
                  <span className="material-symbols-outlined text-[18px]">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* Stats Row */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600">
                  check_circle
                </span>
              </div>
              <div>
                <h4 className="text-[12px] font-semibold text-secondary uppercase tracking-widest">
                  Total Success
                </h4>
                <p className="text-[20px] font-bold text-primary">1,204</p>
              </div>
            </div>
            <div className="glass-card p-6 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-error">
                  error
                </span>
              </div>
              <div>
                <h4 className="text-[12px] font-semibold text-secondary uppercase tracking-widest">
                  Total Failed
                </h4>
                <p className="text-[20px] font-bold text-primary">42</p>
              </div>
            </div>
            <div className="glass-card p-6 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">
                  sync
                </span>
              </div>
              <div>
                <h4 className="text-[12px] font-semibold text-secondary uppercase tracking-widest">
                  Active Requests
                </h4>
                <p className="text-[20px] font-bold text-primary">8</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
