import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function PengaturanPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "transparent" }}>
      <Sidebar />
      <main className="ml-[68px] min-h-screen relative flex flex-col">
        <Topbar title="Pengaturan" />
        <div className="p-6 lg:p-10 flex-1 flex flex-col gap-6">
          <div>
            <h2 className="text-[32px] font-semibold text-primary leading-10 tracking-tight">Pengaturan</h2>
            <p className="text-secondary text-[14px] leading-5 mt-1">System configuration and preferences.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <section className="rounded-2xl overflow-hidden" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
                <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(27, 27, 29, 0.08)" }}>
                  <h3 className="text-[20px] font-semibold text-primary">Company Profile</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider">Company Name</label>
                      <input className="w-full bg-surface-container/50 border border-on-surface/[0.08] rounded-xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all" defaultValue="Fingerspot International" type="text" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider">Email</label>
                      <input className="w-full bg-surface-container/50 border border-on-surface/[0.08] rounded-xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all" defaultValue="admin@fingerspot.com" type="email" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider">Address</label>
                    <textarea className="w-full bg-surface-container/50 border border-on-surface/[0.08] rounded-xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all" rows={3} defaultValue="Jl. Teknologi No. 123, Jakarta Selatan, Indonesia" />
                  </div>
                  <button className="bg-primary text-white font-bold py-2.5 px-6 rounded-xl transition-all hover:bg-primary-container active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/10 w-fit">
                    <span className="material-symbols-outlined text-lg">save</span>
                    Simpan Perubahan
                  </button>
                </div>
              </section>

              <section className="rounded-2xl overflow-hidden" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
                <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(27, 27, 29, 0.08)" }}>
                  <h3 className="text-[20px] font-semibold text-primary">Notification Settings</h3>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { label: "Email Notifications", desc: "Receive email alerts for important events", checked: true },
                    { label: "Late Arrival Alerts", desc: "Get notified when employees arrive late", checked: true },
                    { label: "Absenteeism Reports", desc: "Daily summary of absent employees", checked: false },
                    { label: "System Errors", desc: "Critical system error notifications", checked: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-[14px] font-bold text-primary">{item.label}</p>
                        <p className="text-[12px] text-secondary">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                        <div className="w-11 h-6 bg-surface-container-highest peer-focus:ring-2 peer-focus:ring-primary/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="rounded-2xl overflow-hidden" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
                <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(27, 27, 29, 0.08)" }}>
                  <h3 className="text-[20px] font-semibold text-primary">Appearance</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider">Theme</label>
                    <select className="w-full bg-surface-container/50 border border-on-surface/[0.08] rounded-xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all">
                      <option>Light</option>
                      <option>Dark</option>
                      <option>System</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider">Language</label>
                    <select className="w-full bg-surface-container/50 border border-on-surface/[0.08] rounded-xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all">
                      <option>Bahasa Indonesia</option>
                      <option>English</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl overflow-hidden" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
                <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(27, 27, 29, 0.08)" }}>
                  <h3 className="text-[20px] font-semibold text-primary">API Configuration</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-semibold text-secondary uppercase tracking-wider">API Key</label>
                    <div className="flex gap-2">
                      <input className="flex-1 bg-surface-container/50 border border-on-surface/[0.08] rounded-xl px-4 py-2.5 text-[14px] font-mono" defaultValue="fs_sk_xxxxxxxxxxxx" type="password" readOnly />
                      <button className="px-4 py-2.5 rounded-xl border border-on-surface/[0.08] hover:bg-surface-variant/30 transition-colors">
                        <span className="material-symbols-outlined text-secondary">visibility</span>
                      </button>
                    </div>
                  </div>
                  <button className="w-full bg-transparent hover:bg-surface-variant/30 text-primary font-bold py-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 border border-on-surface/[0.08]" style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px) saturate(150%)", WebkitBackdropFilter: "blur(12px) saturate(150%)", border: "1px solid rgba(255, 255, 255, 0.6)", boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)" }}>
                    <span className="material-symbols-outlined text-lg">refresh</span>
                    Regenerate Key
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
