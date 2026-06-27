import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const webhookData = [
  { id: 1, event: "attendance.created", url: "https://hr.example.com/webhook", status: "Success", lastTriggered: "24 Oct 2023, 17:05" },
  { id: 2, event: "attendance.late", url: "https://notify.example.com/api", status: "Success", lastTriggered: "24 Oct 2023, 08:45" },
  { id: 3, event: "device.offline", url: "https://monitor.example.com/alert", status: "Failed", lastTriggered: "23 Oct 2023, 23:59" },
  { id: 4, event: "employee.registered", url: "https://hr.example.com/webhook", status: "Success", lastTriggered: "24 Oct 2023, 09:10" },
  { id: 5, event: "attendance.created", url: "https://slack.example.com/hook", status: "Success", lastTriggered: "24 Oct 2023, 17:05" },
];

const statusStyles: Record<string, string> = {
  Success: "bg-green-500/10 text-green-700 border border-green-500/20",
  Failed: "bg-red-500/10 text-red-700 border border-red-500/20",
  Pending: "bg-amber-500/10 text-amber-700 border border-amber-500/20",
};

export default function WebhookPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "transparent" }}>
      <Sidebar />
      <main className="ml-[68px] min-h-screen relative flex flex-col">
        <Topbar title="Webhooks" />
        <div className="p-6 lg:p-10 flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[32px] font-semibold text-primary leading-10 tracking-tight">Riwayat Webhook</h2>
              <p className="text-secondary text-[14px] leading-5 mt-1">Monitor webhook deliveries and configurations.</p>
            </div>
            <button className="bg-primary text-white font-bold py-2.5 px-6 rounded-xl transition-all hover:bg-primary-container active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/10">
              <span className="material-symbols-outlined text-lg">add_webhook</span>
              Tambah Webhook
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600">check_circle</span>
                </div>
                <div>
                  <p className="text-[24px] font-bold text-primary">4</p>
                  <p className="text-[12px] text-secondary">Successful</p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-2xl" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-600">error</span>
                </div>
                <div>
                  <p className="text-[24px] font-bold text-primary">1</p>
                  <p className="text-[12px] text-secondary">Failed</p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-2xl" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">webhook</span>
                </div>
                <div>
                  <p className="text-[24px] font-bold text-primary">5</p>
                  <p className="text-[12px] text-secondary">Total Webhooks</p>
                </div>
              </div>
            </div>
          </div>

          <section className="flex-1 rounded-2xl overflow-hidden flex flex-col" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container/30" style={{ borderBottom: "1px solid rgba(27, 27, 29, 0.08)" }}>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Event</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">URL</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Status</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Last Triggered</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-on-surface/[0.04]">
                  {webhookData.map((row) => (
                    <tr key={row.id} className="hover:bg-surface-variant/20 transition-colors">
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-primary/5 text-primary border border-primary/10">{row.event}</span>
                      </td>
                      <td className="py-4 px-6 font-mono text-[13px] text-secondary max-w-xs truncate">{row.url}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${statusStyles[row.status]}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[14px] text-secondary">{row.lastTriggered}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button className="text-outline hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button className="text-outline hover:text-red-600 transition-colors">
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
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
