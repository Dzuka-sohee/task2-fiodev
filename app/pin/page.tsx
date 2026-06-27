import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const pinData = [
  { no: "01", pin: "882190", status: "AKTIF" as const, date: "24 Okt 2023, 14:20" },
  { no: "02", pin: "459012", status: "AKTIF" as const, date: "22 Okt 2023, 09:12" },
  { no: "03", pin: "102934", status: "NON-AKTIF" as const, date: "19 Okt 2023, 17:55" },
  { no: "04", pin: "773410", status: "AKTIF" as const, date: "18 Okt 2023, 11:30" },
  { no: "05", pin: "900122", status: "DITANGGUHKAN" as const, date: "15 Okt 2023, 08:45" },
];

const statusStyles: Record<string, { badge: string; dot: string }> = {
  AKTIF: {
    badge: "bg-green-50 text-green-700 ring-1 ring-green-100",
    dot: "bg-green-500",
  },
  "NON-AKTIF": {
    badge: "bg-secondary-container/30 text-secondary",
    dot: "bg-secondary",
  },
  DITANGGUHKAN: {
    badge: "bg-error-container/20 text-error ring-1 ring-error-container/40",
    dot: "bg-error",
  },
};

export default function PinPage() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-[68px] min-h-screen flex flex-col">
        <Topbar title="Data PIN" />

        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full flex-1">
          {/* Hero Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <h3 className="text-[32px] leading-[40px] tracking-[-0.01em] font-semibold text-primary mb-1">
                Data Personal Identification Number
              </h3>
              <p className="text-secondary text-[14px] leading-5">
                Kelola dan amankan akses PIN pengguna dalam satu panel terpusat.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 md:w-72">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">search</span>
                <input
                  className="w-full pl-11 pr-4 py-2 bg-surface-container rounded-xl border-none ring-1 ring-on-surface/[0.08] focus:ring-primary/30 focus:bg-surface-bright transition-all text-[14px] leading-5"
                  placeholder="Cari PIN atau Pengguna..."
                  type="text"
                />
              </div>
              <button className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-container active:scale-95 transition-all shadow-md shadow-primary/10">
                <span className="material-symbols-outlined text-lg">sync</span>
                <span className="text-[12px] leading-4 font-semibold whitespace-nowrap tracking-[0.05em]">
                  Ambil Semua PIN
                </span>
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="glass-card rounded-2xl overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-variant/30 border-b border-on-surface/[0.05]">
                    <th className="px-6 py-4 text-[12px] leading-4 font-semibold text-secondary uppercase tracking-wider w-20 text-center">
                      No
                    </th>
                    <th className="px-6 py-4 text-[12px] leading-4 font-semibold text-secondary uppercase tracking-wider">
                      PIN User
                    </th>
                    <th className="px-6 py-4 text-[12px] leading-4 font-semibold text-secondary uppercase tracking-wider">
                      Status &amp; Integritas
                    </th>
                    <th className="px-6 py-4 text-[12px] leading-4 font-semibold text-secondary uppercase tracking-wider">
                      Terakhir Diperbarui
                    </th>
                    <th className="px-6 py-4 text-[12px] leading-4 font-semibold text-secondary uppercase tracking-wider text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-on-surface/[0.03]">
                  {pinData.map((row) => (
                    <tr key={row.no} className="hover:bg-surface-bright/50 transition-colors group">
                      <td className="px-6 py-4 text-center text-[14px] leading-5 text-secondary">
                        {row.no}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary-fixed-dim/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-[18px]">key</span>
                          </div>
                          <span className="text-[16px] leading-6 font-bold text-primary tracking-[0.2em] font-mono">
                            {row.pin}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold ${statusStyles[row.status].badge}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-2 ${statusStyles[row.status].dot}`}
                          />
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[14px] leading-5 text-secondary">
                        {row.date}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="w-8 h-8 rounded-lg border border-outline-variant flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all active:scale-90">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button className="w-8 h-8 rounded-lg border border-outline-variant flex items-center justify-center text-secondary hover:bg-error hover:text-white transition-all active:scale-90">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between bg-surface-variant/10 border-t border-on-surface/[0.05]">
              <p className="text-secondary text-[12px] leading-4 font-semibold tracking-[0.05em]">
                Menampilkan 5 dari 1,248 data PIN
              </p>
              <div className="flex items-center gap-2">
                <button className="p-1 rounded-lg border border-outline-variant text-secondary hover:bg-surface-variant transition-colors disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <div className="flex items-center">
                  <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white text-[12px] leading-4 font-semibold">
                    1
                  </span>
                  <span className="w-8 h-8 flex items-center justify-center rounded-lg text-secondary text-[12px] leading-4 font-semibold hover:bg-surface-variant cursor-pointer">
                    2
                  </span>
                  <span className="w-8 h-8 flex items-center justify-center rounded-lg text-secondary text-[12px] leading-4 font-semibold hover:bg-surface-variant cursor-pointer">
                    3
                  </span>
                </div>
                <button className="p-1 rounded-lg border border-outline-variant text-secondary hover:bg-surface-variant transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bento Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tingkat Keamanan */}
            <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  security
                </span>
              </div>
              <div>
                <p className="text-secondary text-[12px] leading-4 font-semibold uppercase tracking-[0.05em]">
                  Tingkat Keamanan
                </p>
                <h4 className="text-[24px] leading-tight font-bold text-primary">
                  94.2% <span className="text-green-500 text-[14px] leading-5 font-normal">↑ 2%</span>
                </h4>
              </div>
            </div>

            {/* Perubahan PIN */}
            <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-fixed-dim/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  history
                </span>
              </div>
              <div>
                <p className="text-secondary text-[12px] leading-4 font-semibold uppercase tracking-[0.05em]">
                  Perubahan PIN
                </p>
                <h4 className="text-[24px] leading-tight font-bold text-primary">
                  12 <span className="text-secondary text-[14px] leading-5 font-normal">Hari ini</span>
                </h4>
              </div>
            </div>

            {/* Storage Health */}
            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <p className="text-secondary text-[12px] leading-4 font-semibold uppercase tracking-[0.05em]">
                  Storage Health
                </p>
                <span className="material-symbols-outlined text-secondary text-sm">info</span>
              </div>
              <div className="mt-4">
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "65%" }} />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-secondary">6.5 GB Used</span>
                  <span className="text-[10px] text-secondary">10 GB Max</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-6 mt-auto flex flex-col md:flex-row items-center justify-between border-t border-on-surface/[0.05] bg-surface-dim/30">
          <p className="text-secondary text-[14px] leading-5">
            &copy; 2023 Fingerspot Cloud Service. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="text-secondary hover:text-primary cursor-pointer transition-colors text-[12px] leading-4 font-semibold tracking-[0.05em]">
              Privacy Policy
            </span>
            <span className="text-secondary hover:text-primary cursor-pointer transition-colors text-[12px] leading-4 font-semibold tracking-[0.05em]">
              Terms of Service
            </span>
            <span className="text-secondary hover:text-primary cursor-pointer transition-colors text-[12px] leading-4 font-semibold tracking-[0.05em]">
              Support
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
