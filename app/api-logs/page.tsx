import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const apiLogsData = [
  { id: 1, method: "GET", endpoint: "/api/attendance", status: 200, responseTime: "45ms", timestamp: "24 Oct 2023, 17:05:42" },
  { id: 2, method: "POST", endpoint: "/api/attendance/punch", status: 201, responseTime: "120ms", timestamp: "24 Oct 2023, 17:05:30" },
  { id: 3, method: "GET", endpoint: "/api/employees", status: 200, responseTime: "32ms", timestamp: "24 Oct 2023, 17:05:15" },
  { id: 4, method: "PUT", endpoint: "/api/employees/00124", status: 200, responseTime: "88ms", timestamp: "24 Oct 2023, 17:04:50" },
  { id: 5, method: "DELETE", endpoint: "/api/webhooks/3", status: 204, responseTime: "55ms", timestamp: "24 Oct 2023, 17:04:20" },
  { id: 6, method: "GET", endpoint: "/api/devices", status: 200, responseTime: "28ms", timestamp: "24 Oct 2023, 17:03:55" },
  { id: 7, method: "POST", endpoint: "/api/auth/login", status: 401, responseTime: "150ms", timestamp: "24 Oct 2023, 17:03:10" },
  { id: 8, method: "GET", endpoint: "/api/reports/daily", status: 500, responseTime: "2300ms", timestamp: "24 Oct 2023, 17:02:45" },
];

const methodStyles: Record<string, string> = {
  GET: "bg-green-500/10 text-green-700 border border-green-500/20",
  POST: "bg-blue-500/10 text-blue-700 border border-blue-500/20",
  PUT: "bg-amber-500/10 text-amber-700 border border-amber-500/20",
  DELETE: "bg-red-500/10 text-red-700 border border-red-500/20",
};

function getStatusColor(status: number) {
  if (status >= 200 && status < 300) return "text-green-600";
  if (status >= 400 && status < 500) return "text-amber-600";
  return "text-red-600";
}

export default function ApiLogsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "transparent" }}>
      <Sidebar />
      <main className="ml-[68px] min-h-screen relative flex flex-col">
        <Topbar title="API Logs" />
        <div className="p-6 lg:p-10 flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[32px] font-semibold text-primary leading-10 tracking-tight">Riwayat Request API</h2>
              <p className="text-secondary text-[14px] leading-5 mt-1">Monitor API request history and performance.</p>
            </div>
            <div className="px-4 py-2 rounded-xl flex items-center gap-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[12px] font-semibold text-secondary uppercase tracking-wider">API Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
              <p className="text-[12px] text-secondary mb-1">Total Requests</p>
              <p className="text-[24px] font-bold text-primary">1,248</p>
            </div>
            <div className="p-5 rounded-2xl" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
              <p className="text-[12px] text-secondary mb-1">Avg Response</p>
              <p className="text-[24px] font-bold text-primary">85ms</p>
            </div>
            <div className="p-5 rounded-2xl" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
              <p className="text-[12px] text-secondary mb-1">Success Rate</p>
              <p className="text-[24px] font-bold text-green-600">99.2%</p>
            </div>
            <div className="p-5 rounded-2xl" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
              <p className="text-[12px] text-secondary mb-1">Error Rate</p>
              <p className="text-[24px] font-bold text-red-600">0.8%</p>
            </div>
          </div>

          <section className="p-6 rounded-2xl" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider ml-1">Method</label>
                <select className="w-full bg-surface-container/50 border border-on-surface/[0.08] rounded-xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all">
                  <option>All Methods</option>
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                  <option>DELETE</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider ml-1">Status</label>
                <select className="w-full bg-surface-container/50 border border-on-surface/[0.08] rounded-xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all">
                  <option>All Status</option>
                  <option>2xx Success</option>
                  <option>4xx Client Error</option>
                  <option>5xx Server Error</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider ml-1">Search Endpoint</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
                  <input className="w-full bg-surface-container/50 border border-on-surface/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-[14px] focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all" placeholder="Search endpoint..." type="text" />
                </div>
              </div>
            </div>
          </section>

          <section className="flex-1 rounded-2xl overflow-hidden flex flex-col" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container/30" style={{ borderBottom: "1px solid rgba(27, 27, 29, 0.08)" }}>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Method</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Endpoint</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Status</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Response Time</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Timestamp</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-on-surface/[0.04]">
                  {apiLogsData.map((row) => (
                    <tr key={row.id} className="hover:bg-surface-variant/20 transition-colors">
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide ${methodStyles[row.method]}`}>
                          {row.method}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-[13px] text-primary">{row.endpoint}</td>
                      <td className="py-4 px-6">
                        <span className={`text-[14px] font-bold ${getStatusColor(row.status)}`}>{row.status}</span>
                      </td>
                      <td className="py-4 px-6 text-[14px] text-secondary">{row.responseTime}</td>
                      <td className="py-4 px-6 text-[14px] text-secondary">{row.timestamp}</td>
                      <td className="py-4 px-6">
                        <button className="text-outline hover:text-primary transition-colors">
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
