import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const users = [
  { no: "01", pin: "10245", name: "Aris Kusuma", initials: "AK", avatarBg: "bg-primary-fixed", avatarText: "text-primary", privilege: "User", cardNo: "0012495822", status: "Active" },
  { no: "02", pin: "10246", name: "Bella Natalia", initials: "BN", avatarBg: "bg-secondary-fixed", avatarText: "text-secondary", privilege: "Supervisor", cardNo: "0012495823", status: "Active" },
  { no: "03", pin: "10247", name: "Candra Kirana", initials: "CK", avatarBg: "bg-surface-container-high", avatarText: "text-secondary", privilege: "User", cardNo: "0012495824", status: "Inactive" },
  { no: "04", pin: "10248", name: "Deni Mahendra", initials: "DM", avatarBg: "bg-primary-fixed-dim", avatarText: "text-primary", privilege: "Admin", cardNo: "0012495825", status: "Active" },
  { no: "05", pin: "10249", name: "Eka Putri", initials: "EP", avatarBg: "bg-tertiary-fixed", avatarText: "text-tertiary", privilege: "User", cardNo: "0012495826", status: "Active" },
];

const statusStyles: Record<string, string> = {
  Active: "bg-primary/10 text-primary",
  Inactive: "bg-outline-variant/30 text-outline",
};

export default function UserPage() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-[68px] min-h-screen">
        <Topbar title="Data User" />
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-6">
          <section className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-1/3 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px]">search</span>
              <input
                className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white/55 backdrop-blur-xl border border-on-surface/[0.08] shadow-[0px_10px_30px_rgba(51,65,85,0.05)] text-[14px] focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all"
                placeholder="Search by Name or PIN..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white/55 backdrop-blur-xl border border-on-surface/[0.08] shadow-[0px_10px_30px_rgba(51,65,85,0.05)] text-secondary font-semibold hover:bg-surface-container-highest transition-all text-[14px]">
                <span className="material-symbols-outlined text-[20px]">sync</span>
                Sinkronisasi dari Mesin
              </button>
              <button className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-semibold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all text-[14px]">
                <span className="material-symbols-outlined text-[20px]">person_add</span>
                Tambah User
              </button>
            </div>
          </section>

          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low/50">
                  <tr>
                    <th className="px-6 py-4 text-[12px] font-semibold text-secondary uppercase tracking-wider">No</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-secondary uppercase tracking-wider">PIN</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-secondary uppercase tracking-wider">Nama</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-secondary uppercase tracking-wider">Privilege</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-secondary uppercase tracking-wider">Card No</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-secondary uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-secondary uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-on-surface/[0.05]">
                  {users.map((user) => (
                    <tr key={user.no} className="hover:bg-[rgba(29,43,62,0.03)] cursor-pointer transition-colors">
                      <td className="px-6 py-4 text-[14px] text-secondary">{user.no}</td>
                      <td className="px-6 py-4 text-[14px] font-semibold text-primary">{user.pin}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${user.avatarBg} flex items-center justify-center ${user.avatarText} text-[10px] font-bold`}>
                            {user.initials}
                          </div>
                          <span className="text-[14px] font-semibold text-primary">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-secondary">{user.privilege}</td>
                      <td className="px-6 py-4 text-[14px] text-outline">{user.cardNo}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full ${statusStyles[user.status]} text-[10px] font-bold uppercase tracking-tight`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="material-symbols-outlined text-outline hover:text-primary transition-colors">more_vert</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-surface-container-low/30 border-t border-on-surface/[0.05] flex items-center justify-between">
              <span className="text-[12px] font-semibold text-secondary">Showing 1-5 of 1,240 users</span>
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-surface-variant transition-all">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary text-white text-[14px] font-bold">1</button>
                <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-surface-variant text-[14px]">2</button>
                <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-surface-variant text-[14px]">3</button>
                <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-surface-variant transition-all">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-xl flex flex-col justify-between">
              <span className="text-[12px] font-semibold text-secondary uppercase tracking-widest">Total Users</span>
              <div className="mt-4">
                <span className="text-[48px] font-bold text-primary leading-none">1,240</span>
                <div className="flex items-center text-primary/60 text-[14px] gap-1 mt-2">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span>+12 this month</span>
                </div>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-xl flex flex-col justify-between">
              <span className="text-[12px] font-semibold text-secondary uppercase tracking-widest">Admins</span>
              <div className="mt-4">
                <span className="text-[48px] font-bold text-primary leading-none">08</span>
                <div className="flex items-center text-primary/60 text-[14px] gap-1 mt-2">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  <span>High clearance</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-2 glass-panel p-6 rounded-xl flex items-center justify-between overflow-hidden relative">
              <div className="z-10">
                <span className="text-[12px] font-semibold text-secondary uppercase tracking-widest">Sync Health</span>
                <h4 className="text-[20px] font-semibold text-primary mt-2">Devices Connected</h4>
                <p className="text-[14px] text-secondary mt-1">All terminals successfully synchronized 4m ago.</p>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10">
                <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>router</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
