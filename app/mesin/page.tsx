import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const mesinData = [
  { id: 1, name: "Finger-01", location: "Lobby Utama", ip: "192.168.1.101", status: "Online", lastSync: "24 Oct 2023, 17:05" },
  { id: 2, name: "Finger-02", location: "Lantai 2", ip: "192.168.1.102", status: "Online", lastSync: "24 Oct 2023, 17:05" },
  { id: 3, name: "Card-01", location: "Parkir Selatan", ip: "192.168.1.103", status: "Offline", lastSync: "23 Oct 2023, 23:59" },
  { id: 4, name: "Face-01", location: "Server Room", ip: "192.168.1.104", status: "Online", lastSync: "24 Oct 2023, 17:05" },
  { id: 5, name: "Finger-03", location: "Cafeteria", ip: "192.168.1.105", status: "Online", lastSync: "24 Oct 2023, 16:30" },
];

const statusStyles: Record<string, string> = {
  Online: "bg-green-500/10 text-green-700 border border-green-500/20",
  Offline: "bg-red-500/10 text-red-700 border border-red-500/20",
  Maintenance: "bg-amber-500/10 text-amber-700 border border-amber-500/20",
};

export default function MesinPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "transparent" }}>
      <Sidebar />
      <main className="ml-[68px] min-h-screen relative flex flex-col">
        <Topbar title="Mesin" />
        <div className="p-6 lg:p-10 flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[32px] font-semibold text-primary leading-10 tracking-tight">Mesin</h2>
              <p className="text-secondary text-[14px] leading-5 mt-1">Manage attendance devices and their connections.</p>
            </div>
            <button className="bg-primary text-white font-bold py-2.5 px-6 rounded-xl transition-all hover:bg-primary-container active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/10">
              <span className="material-symbols-outlined text-lg">add_to_queue</span>
              Tambah Mesin
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600">wifi</span>
                </div>
                <div>
                  <p className="text-[24px] font-bold text-primary">4</p>
                  <p className="text-[12px] text-secondary">Online</p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-2xl" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-600">wifi_off</span>
                </div>
                <div>
                  <p className="text-[24px] font-bold text-primary">1</p>
                  <p className="text-[12px] text-secondary">Offline</p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-2xl" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">devices</span>
                </div>
                <div>
                  <p className="text-[24px] font-bold text-primary">5</p>
                  <p className="text-[12px] text-secondary">Total Mesin</p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-2xl" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-600">sync</span>
                </div>
                <div>
                  <p className="text-[24px] font-bold text-primary">98%</p>
                  <p className="text-[12px] text-secondary">Uptime</p>
                </div>
              </div>
            </div>
          </div>

          <section className="flex-1 rounded-2xl overflow-hidden flex flex-col" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container/30" style={{ borderBottom: "1px solid rgba(27, 27, 29, 0.08)" }}>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Nama Mesin</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Lokasi</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">IP Address</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Status</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Last Sync</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-on-surface/[0.04]">
                  {mesinData.map((row) => (
                    <tr key={row.id} className="hover:bg-surface-variant/20 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-primary-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-on-primary-container text-sm">devices</span>
                          </div>
                          <span className="text-[14px] font-bold text-primary">{row.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[14px] text-secondary">{row.location}</td>
                      <td className="py-4 px-6 font-mono text-[14px] text-primary">{row.ip}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${statusStyles[row.status]}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[14px] text-secondary">{row.lastSync}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button className="text-outline hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">sync</span>
                          </button>
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
