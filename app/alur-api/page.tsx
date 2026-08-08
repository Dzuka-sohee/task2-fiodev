"use client";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const apiEndpoints = [
  { method: "POST", path: "/mesin/get-all-pin", remote: "/api/get_all_pin", desc: "Mengambil semua PIN yang terdaftar di mesin fingerprint" },
  { method: "POST", path: "/mesin/get-userinfo", remote: "/api/get_userinfo", desc: "Mengambil data user (nama, privilege, PIN) dari mesin" },
  { method: "POST", path: "/mesin/get-attlog", remote: "/api/get_attlog", desc: "Mengambil log absensi dari mesin dalam rentang tanggal tertentu" },
  { method: "POST", path: "/mesin/set-userinfo", remote: "/api/set_userinfo", desc: "Mengirim data user baru atau memperbarui user di mesin" },
  { method: "POST", path: "/mesin/delete-userinfo", remote: "/api/delete_userinfo", desc: "Menghapus user dari mesin berdasarkan PIN" },
  { method: "POST", path: "/mesin/set-time", remote: "/api/set_time", desc: "Menyinkronkan waktu server ke mesin" },
  { method: "POST", path: "/mesin/restart", remote: "/api/restart_device", desc: "Merestart mesin dari jarak jauh" },
  { method: "POST", path: "/mesin/register-online", remote: "/api/reg_online", desc: "Mendaftarkan mesin untuk koneksi online" },
];

const webhookEvents = [
  { event: "attlog", desc: "Log absensi baru dari mesin (scan jari/kartu/wajah)" },
  { event: "user_info", desc: "Update data user dari mesin" },
  { event: "pin_info", desc: "Update informasi PIN dari mesin" },
  { event: "device_status", desc: "Status perubahan pada mesin" },
];

function FlowBox({ label, sub, color }: { label: string; sub?: string; color: string }) {
  return (
    <div className={`px-4 py-3 rounded-xl text-center border ${color} min-w-[140px]`}>
      <p className="text-sm font-bold text-primary">{label}</p>
      {sub && <p className="text-[11px] text-secondary mt-0.5">{sub}</p>}
    </div>
  );
}

function Arrow({ direction = "right" }: { direction?: string }) {
  if (direction === "down") {
    return (
      <div className="flex justify-center py-1">
        <div className="flex flex-col items-center">
          <div className="w-[2px] h-5 bg-primary/30" />
          <span className="material-symbols-outlined text-primary/40 text-lg -mt-1">expand_more</span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center px-1">
      <div className="w-6 h-[2px] bg-primary/30" />
      <span className="material-symbols-outlined text-primary/40 text-lg -ml-1">chevron_right</span>
    </div>
  );
}

export default function AlurApiPage() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-[68px] min-h-screen">
        <Topbar title="Alur API & Webhook" />
        <div className="p-6 lg:p-10 space-y-8">

          {/* Alur API Outgoing */}
          <section className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary">upload</span>
              <h2 className="text-[20px] leading-[28px] font-semibold text-primary">Alur API (Outgoing)</h2>
            </div>
            <p className="text-sm text-secondary mb-6">Permintaan dari dashboard dikirim ke Fingerspot Cloud API melalui server Next.js.</p>

            {/* Flow diagram */}
            <div className="glass-card p-6 rounded-xl mb-6 overflow-x-auto">
              <div className="flex items-center justify-center gap-0 min-w-[700px]">
                <FlowBox label="Dashboard" sub="User klik tombol" color="bg-blue-50 border-blue-200" />
                <Arrow />
                <FlowBox label="Next.js API Route" sub="/mesin/*" color="bg-slate-50 border-slate-200" />
                <Arrow />
                <FlowBox label="callFingerspot()" sub="lib/fingerspot.ts" color="bg-amber-50 border-amber-200" />
                <Arrow />
                <FlowBox label="Fingerspot Cloud" sub="developer.fingerspot.io" color="bg-green-50 border-green-200" />
                <Arrow />
                <FlowBox label="Mesin Fingerprint" sub="Perangkat fisik" color="bg-purple-50 border-purple-200" />
              </div>
            </div>

            {/* Detail alur */}
            <div className="space-y-3 text-sm text-secondary">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">1</span>
                <p><strong className="text-primary">User</strong> melakukan aksi di dashboard (contoh: Fetch All PIN, Set Time, Restart).</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">2</span>
                <p>Dashboard mengirim <code className="bg-surface-variant/50 px-1.5 py-0.5 rounded text-xs font-mono">POST</code> request ke route <code className="bg-surface-variant/50 px-1.5 py-0.5 rounded text-xs font-mono">/mesin/*</code>.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">3</span>
                <p>Route handler memanggil <code className="bg-surface-variant/50 px-1.5 py-0.5 rounded text-xs font-mono">callFingerspot()</code> yang menambahkan <code className="bg-surface-variant/50 px-1.5 py-0.5 rounded text-xs font-mono">cloud_id</code> dan mengirim request ke Fingerspot Cloud API dengan header <code className="bg-surface-variant/50 px-1.5 py-0.5 rounded text-xs font-mono">Authorization: Bearer {'<API_KEY>'}</code>.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">4</span>
                <p>Fingerspot Cloud meneruskan command ke mesin fingerprint. Status request dicatat di tabel <code className="bg-surface-variant/50 px-1.5 py-0.5 rounded text-xs font-mono">api_requests</code> dan <code className="bg-surface-variant/50 px-1.5 py-0.5 rounded text-xs font-mono">command_logs</code>.</p>
              </div>
            </div>
          </section>

          {/* Alur Webhook Incoming */}
          <section className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary">download</span>
              <h2 className="text-[20px] leading-[28px] font-semibold text-primary">Alur Webhook (Incoming)</h2>
            </div>
            <p className="text-sm text-secondary mb-6">Fingerspot Cloud mengirim data ke database Supabase melalui Edge Function (webhook).</p>

            {/* Flow diagram */}
            <div className="glass-card p-6 rounded-xl mb-6 overflow-x-auto">
              <div className="flex items-center justify-center gap-0 min-w-[700px]">
                <FlowBox label="Mesin Fingerprint" sub="Scan jari/kartu" color="bg-purple-50 border-purple-200" />
                <Arrow />
                <FlowBox label="Fingerspot Cloud" sub="Event terdeteksi" color="bg-green-50 border-green-200" />
                <Arrow />
                <FlowBox label="Supabase Edge Function" sub="Webhook receiver" color="bg-cyan-50 border-cyan-200" />
                <Arrow />
                <FlowBox label="Supabase Database" sub="Tabel: webhook_logs, attlogs, dll" color="bg-rose-50 border-rose-200" />
                <Arrow />
                <FlowBox label="Dashboard" sub="Data muncul otomatis" color="bg-blue-50 border-blue-200" />
              </div>
            </div>

            {/* Detail alur */}
            <div className="space-y-3 text-sm text-secondary">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">1</span>
                <p>Karyawan melakukan scan di mesin fingerprint (jari, kartu, wajah, atau vein).</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">2</span>
                <p>Mesin mengirim event ke <strong className="text-primary">Fingerspot Cloud</strong>.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">3</span>
                <p>Fingerspot Cloud memanggil <strong className="text-primary">Supabase Edge Function</strong> (webhook URL yang dikonfigurasi di portal Fingerspot). Edge Function memvalidasi <code className="bg-surface-variant/50 px-1.5 py-0.5 rounded text-xs font-mono">x-webhook-secret</code> lalu menyimpan data ke tabel <code className="bg-surface-variant/50 px-1.5 py-0.5 rounded text-xs font-mono">webhook_logs</code> dan tabel terkait (<code className="bg-surface-variant/50 px-1.5 py-0.5 rounded text-xs font-mono">attlogs</code>, <code className="bg-surface-variant/50 px-1.5 py-0.5 rounded text-xs font-mono">userinfos</code>, <code className="bg-surface-variant/50 px-1.5 py-0.5 rounded text-xs font-mono">pins</code>).</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">4</span>
                <p>Dashboard mengambil data langsung dari Supabase (real-time) dan menampilkannya ke user.</p>
              </div>
            </div>
          </section>

          {/* Tabel Endpoint API */}
          <section className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary">api</span>
              <h2 className="text-[20px] leading-[28px] font-semibold text-primary">Endpoint API Internal</h2>
            </div>
            <p className="text-sm text-secondary mb-6">Semua endpoint menggunakan method POST dan dipanggil dari frontend dashboard.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[12px] font-semibold text-secondary border-b border-outline-variant/20 uppercase tracking-widest">
                    <th className="pb-3 font-bold">Method</th>
                    <th className="pb-3 font-bold">Endpoint</th>
                    <th className="pb-3 font-bold">Remote API</th>
                    <th className="pb-3 font-bold">Deskripsi</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {apiEndpoints.map((ep, i) => (
                    <tr key={i} className="border-b border-outline-variant/10 hover:bg-surface-variant/20 transition-colors">
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">POST</span>
                      </td>
                      <td className="py-3 font-mono text-xs text-primary">{ep.path}</td>
                      <td className="py-3 font-mono text-xs text-secondary">{ep.remote}</td>
                      <td className="py-3 text-secondary">{ep.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Tabel Webhook Events */}
          <section className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary">webhook</span>
              <h2 className="text-[20px] leading-[28px] font-semibold text-primary">Event Webhook</h2>
            </div>
            <p className="text-sm text-secondary mb-6">Jenis event yang dikirim oleh Fingerspot Cloud ke Supabase Edge Function.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[12px] font-semibold text-secondary border-b border-outline-variant/20 uppercase tracking-widest">
                    <th className="pb-3 font-bold">Event</th>
                    <th className="pb-3 font-bold">Deskripsi</th>
                    <th className="pb-3 font-bold">Tabel Target</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {webhookEvents.map((ev, i) => (
                    <tr key={i} className="border-b border-outline-variant/10 hover:bg-surface-variant/20 transition-colors">
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700">{ev.event}</span>
                      </td>
                      <td className="py-3 text-secondary">{ev.desc}</td>
                      <td className="py-3 font-mono text-xs text-secondary">
                        {ev.event === "attlog" && "attlogs, webhook_logs"}
                        {ev.event === "user_info" && "userinfos, webhook_logs"}
                        {ev.event === "pin_info" && "pins, webhook_logs"}
                        {ev.event === "device_status" && "webhook_logs"}
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
