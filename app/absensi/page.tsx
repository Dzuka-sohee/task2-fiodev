import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const attendanceData = [
  { no: 1, pin: "00124", name: "Jonathan Doe", initials: "JD", time: "24 Oct 2023, 08:02:15", verification: "fingerprint", verificationLabel: "Fingerprint", status: "Success", avatarBg: "bg-secondary-container", avatarText: "text-secondary" },
  { no: 2, pin: "00156", name: "Sarah Miller", initials: "SM", time: "24 Oct 2023, 08:15:42", verification: "face", verificationLabel: "Face ID", status: "Warning", avatarBg: "bg-tertiary-fixed-dim", avatarText: "text-tertiary" },
  { no: 3, pin: "00109", name: "Alex Kim", initials: "AK", time: "24 Oct 2023, 08:30:01", verification: "pin", verificationLabel: "PIN Entry", status: "Success", avatarBg: "bg-primary-fixed-dim", avatarText: "text-primary" },
  { no: 4, pin: "00221", name: "Ben Thompson", initials: "BT", time: "24 Oct 2023, 09:05:12", verification: "nfc", verificationLabel: "RFID Card", status: "Invalid", avatarBg: "bg-surface-container-highest", avatarText: "text-on-surface-variant" },
  { no: 5, pin: "00088", name: "Linda Wu", initials: "LW", time: "24 Oct 2023, 09:12:33", verification: "fingerprint", verificationLabel: "Fingerprint", status: "Success", avatarBg: "bg-secondary-fixed", avatarText: "text-on-secondary-fixed" },
];

const statusStyles: Record<string, string> = {
  Success: "bg-green-500/10 text-green-700 border border-green-500/20",
  Warning: "bg-amber-500/10 text-amber-700 border border-amber-500/20",
  Invalid: "bg-error/10 text-error border border-error/20",
};

const verificationIcons: Record<string, string> = {
  fingerprint: "fingerprint",
  face: "face",
  pin: "pin",
  nfc: "nfc",
};

export default function AbsensiPage() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-[68px] min-h-screen relative flex flex-col">
        <Topbar title="Data Absensi" />
        <div className="p-6 lg:p-10 flex-1 flex flex-col gap-6">
          {/* Header */}
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

          {/* Filter Bar */}
          <section className="glass-card p-6 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
              <div className="lg:col-span-2 flex flex-col gap-2">
                <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider ml-1">Start Date</label>
                <div className="relative">
                  <input className="w-full bg-surface-container/50 border border-on-surface/[0.08] rounded-xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all" type="date" />
                </div>
              </div>
              <div className="lg:col-span-2 flex flex-col gap-2">
                <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider ml-1">End Date</label>
                <div className="relative">
                  <input className="w-full bg-surface-container/50 border border-on-surface/[0.08] rounded-xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all" type="date" />
                </div>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-2">
                <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider ml-1">Search User</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
                  <input className="w-full bg-surface-container/50 border border-on-surface/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-[14px] focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all" placeholder="PIN or Name..." type="text" />
                </div>
              </div>
              <div className="lg:col-span-4 flex gap-4">
                <button className="flex-1 glass-card bg-transparent hover:bg-surface-variant/30 text-primary font-bold py-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 border border-on-surface/[0.08]">
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

          {/* Data Table */}
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
                          <div className={`w-8 h-8 rounded-full ${row.avatarBg} flex items-center justify-center ${row.avatarText} text-xs font-bold`}>
                            {row.initials}
                          </div>
                          <span className="text-[14px] font-bold text-primary">{row.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[14px] text-secondary">{row.time}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-[14px] text-secondary">
                          <span className="material-symbols-outlined text-sm">{verificationIcons[row.verification]}</span>
                          {row.verificationLabel}
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

            {/* Pagination Footer */}
            <div className="mt-auto border-t border-on-surface/[0.08] px-6 py-4 flex items-center justify-between">
              <p className="text-[14px] text-secondary">Showing <span className="font-bold text-primary">1 - 5</span> of 1,240 records</p>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-on-surface/[0.08] text-secondary hover:bg-surface-variant/50 transition-colors disabled:opacity-30" disabled>
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-xs">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-on-surface/[0.08] text-secondary hover:bg-surface-variant/50 transition-colors font-bold text-xs">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-on-surface/[0.08] text-secondary hover:bg-surface-variant/50 transition-colors font-bold text-xs">3</button>
                <span className="text-secondary mx-1">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-on-surface/[0.08] text-secondary hover:bg-surface-variant/50 transition-colors font-bold text-xs">248</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-on-surface/[0.08] text-secondary hover:bg-surface-variant/50 transition-colors">
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
