import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const userData = [
  { id: 1, pin: "00124", name: "Jonathan Doe", role: "Admin", department: "IT", status: "Active" },
  { id: 2, pin: "00089", name: "Maria Garcia", role: "User", department: "HR", status: "Active" },
  { id: 3, pin: "00045", name: "Ahmad Fauzi", role: "User", department: "Engineering", status: "Active" },
  { id: 4, pin: "00201", name: "Siti Rahmawati", role: "Manager", department: "Marketing", status: "Active" },
  { id: 5, pin: "00067", name: "Budi Santoso", role: "User", department: "Finance", status: "Inactive" },
  { id: 6, pin: "00156", name: "Dewi Lestari", role: "User", department: "Operations", status: "Active" },
  { id: 7, pin: "00033", name: "Rizki Firmansyah", role: "User", department: "Engineering", status: "Active" },
  { id: 8, pin: "00178", name: "Maya Putri", role: "Manager", department: "Marketing", status: "Active" },
];

const statusStyles: Record<string, string> = {
  Active: "bg-green-500/10 text-green-700 border border-green-500/20",
  Inactive: "bg-red-500/10 text-red-700 border border-red-500/20",
};

export default function UserPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "transparent" }}>
      <Sidebar />
      <main className="ml-[68px] min-h-screen relative flex flex-col">
        <Topbar title="Data User" />
        <div className="p-6 lg:p-10 flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[32px] font-semibold text-primary leading-10 tracking-tight">Data User</h2>
              <p className="text-secondary text-[14px] leading-5 mt-1">Manage user accounts and access permissions.</p>
            </div>
            <button className="bg-primary text-white font-bold py-2.5 px-6 rounded-xl transition-all hover:bg-primary-container active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/10">
              <span className="material-symbols-outlined text-lg">person_add</span>
              Tambah User
            </button>
          </div>

          <section className="p-6 rounded-2xl" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider ml-1">Search</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
                  <input className="w-full bg-surface-container/50 border border-on-surface/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-[14px] focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all" placeholder="Search by name or PIN..." type="text" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider ml-1">Department</label>
                <select className="w-full bg-surface-container/50 border border-on-surface/[0.08] rounded-xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all">
                  <option>All Departments</option>
                  <option>IT</option>
                  <option>HR</option>
                  <option>Engineering</option>
                  <option>Marketing</option>
                  <option>Finance</option>
                  <option>Operations</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider ml-1">Status</label>
                <select className="w-full bg-surface-container/50 border border-on-surface/[0.08] rounded-xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
          </section>

          <section className="flex-1 rounded-2xl overflow-hidden flex flex-col" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container/30" style={{ borderBottom: "1px solid rgba(27, 27, 29, 0.08)" }}>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">PIN</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Nama</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Role</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Departemen</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Status</th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-secondary uppercase tracking-widest">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-on-surface/[0.04]">
                  {userData.map((row) => (
                    <tr key={row.id} className="hover:bg-surface-variant/20 transition-colors">
                      <td className="py-4 px-6 font-mono text-[14px] text-primary">{row.pin}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-secondary text-xs font-bold">
                            {row.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="text-[14px] font-bold text-primary">{row.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[14px] text-secondary">{row.role}</td>
                      <td className="py-4 px-6 text-[14px] text-secondary">{row.department}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${statusStyles[row.status]}`}>
                          {row.status}
                        </span>
                      </td>
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
