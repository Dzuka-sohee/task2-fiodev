import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const attendanceData = [
  { no: 1, pin: "00124", name: "Jonathan Doe", time: "24 Oct 2023, 08:02:15", verification: "fingerprint", status: "Success" },
  { no: 2, pin: "00124", name: "Jonathan Doe", time: "24 Oct 2023, 17:05:42", verification: "fingerprint", status: "Success" },
  { no: 3, pin: "00089", name: "Maria Garcia", time: "24 Oct 2023, 08:15:03", verification: "password", status: "Success" },
  { no: 4, pin: "00045", name: "Ahmad Fauzi", time: "24 Oct 2023, 07:55:21", verification: "fingerprint", status: "Success" },
  { no: 5, pin: "00201", name: "Siti Rahmawati", time: "24 Oct 2023, 08:45:12", verification: "card", status: "Late" },
  { no: 6, pin: "00067", name: "Budi Santoso", time: "24 Oct 2023, 09:10:33", verification: "fingerprint", status: "Late" },
  { no: 7, pin: "00156", name: "Dewi Lestari", time: "24 Oct 2023, 08:00:01", verification: "fingerprint", status: "Success" },
  { no: 8, pin: "00033", name: "Rizki Firmansyah", time: "24 Oct 2023, 08:02:45", verification: "password", status: "Success" },
];

const statusStyles: Record<string, string> = {
  Success: "bg-green-500/10 text-green-700 border border-green-500/20",
  Late: "bg-amber-500/10 text-amber-700 border border-amber-500/20",
  Failed: "bg-red-500/10 text-red-700 border border-red-500/20",
};

const verificationIcons: Record<string, string> = {
  fingerprint: "fingerprint",
  password: "lock",
  card: "credit_card",
};

export default function AbsensiPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "transparent" }}>
      <Sidebar />
      <main className="ml-[68px] min-h-screen relative flex flex-col">
        <Topbar title="Data Absensi" />
        <div className="p-6 lg:p-10 flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[32px] font-semibold text-primary leading-10 tracking-tight">Attendance Logs</h2>
              <p className="text-secondary text-[14px] leading-5 mt-1">Real-time monitoring of personnel movements and clock-in events.</p>
            </div>
            <div className="px-4 py-2 rounded-xl flex items-center gap-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[12px] font-semibold text-secondary uppercase tracking-wider">System Online</span>
            </div>
          </div>

          <section className="p-6 rounded-2xl" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
              <div className="lg:col-span-2 flex flex-col gap-2">
                <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider ml-1">Start Date</label>
                <input className="w-full bg-surface-container/50 border border-on-surface/[0.08] rounded-xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all" type="date" />
              </div>
              <div className="lg:col-span-2 flex flex-col gap-2">
                <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider ml-1">End Date</label>
                <input className="w-full bg-surface-container/50 border border-on-surface/[0.08] rounded-xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all" type="date" />
              </div>
              <div className="lg:col-span-4 flex flex-col gap-2">
                <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider ml-1">Search User</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
                  <input className="w-full bg-surface-container/50 border border-on-surface/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-[14px] focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all" placeholder="PIN or Name..." type="text" />
                </div>
              </div>
              <div className="lg:col-span-4 flex gap-4">
                <button className="flex-1 bg-transparent hover:bg-surface-variant/30 text-primary font-bold py-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 border border-on-surface/[0.08]" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
                  <span className="material-symbols-outlined text-lg">refresh</span>
                  Refresh
                </button>
                <button className="flex-1 bg-primary text-white font-bold py-2.5 rounded-xl transition-all hover:bg-primary-container active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary/10">
                  <span className="material-symbols-outlined text-lg">download</span>
                  Export CSV
                </button>
              </div>
            </div>
          </section>

          <section className="flex-1 rounded-2xl overflow-hidden flex flex-col" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container/30" style={{ borderBottom: "1px solid rgba(27, 27, 29, 0.08)" }}>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">No</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">PIN</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Nama Personnel</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Waktu Scan</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Tipe Verifikasi</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Status</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-on-surface/[0.04]">
                  {attendanceData.map((row) => (
                    <tr key={row.no} className="hover:bg-surface-variant/20 transition-colors">
                      <td className="py-4 px-6 text-[14px] font-medium">{row.no}</td>
                      <td className="py-4 px-6 font-mono text-[14px] text-primary">{row.pin}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-secondary text-xs font-bold">
                            {row.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="text-[14px] font-bold text-primary">{row.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[14px] text-secondary">{row.time}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-[14px] text-secondary">
                          <span className="material-symbols-outlined text-sm">{verificationIcons[row.verification]}</span>
                          {row.verification.charAt(0).toUpperCase() + row.verification.slice(1)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${statusStyles[row.status]}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button className="text-outline hover:text-primary transition-colors">
                          <span className="material-symbols-outlined">more_vert</span>
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
