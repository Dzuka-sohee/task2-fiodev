import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const webhookLogs = [
  {
    id: "01",
    time: "2023-11-27 08:15:32",
    event: "ATTENDANCE_CHECKIN",
    endpoint: "https://api.internal-hr.com/v1/sync",
    status: "200 OK",
    statusType: "success",
  },
  {
    id: "02",
    time: "2023-11-27 08:14:01",
    event: "USER_UPDATE",
    endpoint: "https://webhook.site/b2a1...",
    status: "503 ERROR",
    statusType: "error",
  },
  {
    id: "03",
    time: "2023-11-27 08:10:45",
    event: "ATTENDANCE_CHECKOUT",
    endpoint: "https://api.internal-hr.com/v1/sync",
    status: "200 OK",
    statusType: "success",
  },
  {
    id: "04",
    time: "2023-11-27 07:55:12",
    event: "DEVICE_OFFLINE",
    endpoint: "https://monitoring.fingerspot.com/log",
    status: "408 TIMEOUT",
    statusType: "warning",
  },
];

const statusStyles: Record<string, string> = {
  success:
    "bg-green-100/50 text-green-700 border border-green-200",
  error:
    "bg-error-container/30 text-error border border-error/10",
  warning:
    "bg-orange-100/50 text-orange-700 border border-orange-200",
};

const statusDotColors: Record<string, string> = {
  success: "bg-green-500",
  error: "bg-error",
  warning: "bg-orange-500",
};

const barData = [
  { height: "80%", className: "bg-primary/20" },
  { height: "85%", className: "bg-primary/30" },
  { height: "40%", className: "bg-primary/10" },
  { height: "75%", className: "bg-primary/25" },
  { height: "90%", className: "bg-primary/35" },
  { height: "55%", className: "bg-primary/15" },
  { height: "95%", className: "bg-primary/40" },
  { height: "65%", className: "bg-primary/20" },
  { height: "80%", className: "bg-primary/30" },
  { height: "30%", className: "bg-primary/10" },
  { height: "70%", className: "bg-primary/25" },
  { height: "100%", className: "bg-primary/40" },
];

export default function WebhookPage() {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <Sidebar />
      <main className="ml-[68px] min-h-screen relative flex flex-col">
        <Topbar title="Riwayat Webhook" />
        <div className="p-6 lg:p-10 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-headline-lg text-headline-lg text-primary">
              Log Webhook Berjalan
            </h2>
            <p className="font-body-lg text-body-lg text-secondary max-w-2xl">
              Pantau semua aktivitas pengiriman data otomatis dari sistem ke
              endpoint URL yang telah dikonfigurasi.
            </p>
          </div>

          <div className="glass-card rounded-xl p-4 flex flex-wrap items-center gap-6">
            <div className="flex flex-col gap-1 min-w-[200px]">
              <label className="font-label-md text-label-md text-secondary ml-1">
                Rentang Waktu
              </label>
              <input
                type="date"
                className="w-full bg-white/50 border border-outline-variant/30 rounded-lg px-4 py-2 font-body-sm text-body-sm focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-1 min-w-[180px]">
              <label className="font-label-md text-label-md text-secondary ml-1">
                Event Type
              </label>
              <select className="w-full bg-white/50 border border-outline-variant/30 rounded-lg px-4 py-2 font-body-sm text-body-sm focus:ring-2 focus:ring-primary/10 focus:outline-none appearance-none cursor-pointer">
                <option value="">Semua Event</option>
                <option value="checkin">Check-In</option>
                <option value="checkout">Check-Out</option>
                <option value="user_created">User Created</option>
                <option value="device_offline">Device Offline</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 min-w-[150px]">
              <label className="font-label-md text-label-md text-secondary ml-1">
                Status
              </label>
              <select className="w-full bg-white/50 border border-outline-variant/30 rounded-lg px-4 py-2 font-body-sm text-body-sm focus:ring-2 focus:ring-primary/10 focus:outline-none appearance-none cursor-pointer">
                <option value="">Semua Status</option>
                <option value="200">Success (200)</option>
                <option value="400">Client Error (4xx)</option>
                <option value="500">Server Error (5xx)</option>
              </select>
            </div>
            <div className="flex-grow"></div>
            <button className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-primary-container transition-all active:scale-95 shadow-lg shadow-primary/10">
              <span className="material-symbols-outlined text-sm">
                filter_alt
              </span>
              Terapkan Filter
            </button>
            <button className="bg-surface-variant/50 text-secondary border border-outline-variant/30 px-6 py-2.5 rounded-lg font-label-md text-label-md hover:bg-surface-variant transition-all active:scale-95">
              Reset
            </button>
          </div>

          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container/30 border-b border-on-surface/[0.05]">
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider w-16">
                      No
                    </th>
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">
                      Waktu
                    </th>
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">
                      Event Type
                    </th>
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">
                      Endpoint URL
                    </th>
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-on-surface/[0.05]">
                  {webhookLogs.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-surface-bright/50 transition-colors group"
                    >
                      <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">
                        {row.id}
                      </td>
                      <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface">
                        {row.time}
                      </td>
                      <td className="px-6 py-4">
                        <code className="bg-secondary-container/20 text-secondary font-mono text-[11px] px-2 py-1 rounded">
                          {row.event}
                        </code>
                      </td>
                      <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant truncate max-w-[200px]">
                        {row.endpoint}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold ${statusStyles[row.statusType]}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${statusDotColors[row.statusType]} mr-1.5`}
                          ></span>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-primary/10 rounded-full transition-all text-secondary group-hover:text-primary">
                          <span className="material-symbols-outlined text-md">
                            visibility
                          </span>
                        </button>
                        <button className="p-2 hover:bg-primary/10 rounded-full transition-all text-secondary hover:text-primary ml-1">
                          <span className="material-symbols-outlined text-md">
                            replay
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-surface-container/10 border-t border-on-surface/[0.05] flex items-center justify-between">
              <p className="font-label-md text-label-md text-secondary">
                Menampilkan 1-4 dari 280 riwayat
              </p>
              <div className="flex items-center gap-2">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-secondary hover:bg-surface-variant transition-all disabled:opacity-50"
                  disabled
                >
                  <span className="material-symbols-outlined text-sm">
                    chevron_left
                  </span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary font-label-md text-label-md">
                  1
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-secondary hover:bg-surface-variant transition-all font-label-md text-label-md">
                  2
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-secondary hover:bg-surface-variant transition-all font-label-md text-label-md">
                  3
                </button>
                <span className="text-secondary px-1">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-secondary hover:bg-surface-variant transition-all font-label-md text-label-md">
                  70
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-secondary hover:bg-surface-variant transition-all">
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
            <div className="lg:col-span-8 glass-card rounded-xl p-6">
              <h3 className="font-title-md text-title-md text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  analytics
                </span>
                Tingkat Keberhasilan (24 Jam Terakhir)
              </h3>
              <div className="relative h-48 w-full flex items-end gap-2 px-2">
                <div className="flex-grow flex items-end justify-around h-full border-b border-outline-variant/20">
                  {barData.map((bar, i) => (
                    <div
                      key={i}
                      className={`w-full ${bar.className} rounded-t-sm relative group`}
                      style={{ height: bar.height }}
                    >
                      {i === 0 && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          94%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-4 text-[10px] text-secondary font-label-md">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>23:59</span>
              </div>
            </div>

            <div className="lg:col-span-4 glass-card rounded-xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-title-md text-title-md text-primary mb-4">
                  Status Kesehatan
                </h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full border-4 border-green-500/20 text-green-600 font-bold text-lg">
                    98%
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">
                      Sangat Baik
                    </p>
                    <p className="font-body-sm text-body-sm text-secondary">
                      Rata-rata latensi 240ms
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-lg">
                  <span className="font-body-sm text-body-sm text-on-surface">
                    Total Dikirim
                  </span>
                  <span className="font-bold text-primary">12.482</span>
                </div>
                <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-lg">
                  <span className="font-body-sm text-body-sm text-on-surface">
                    Gagal (4xx/5xx)
                  </span>
                  <span className="font-bold text-error">124</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
