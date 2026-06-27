"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const historyData = [
  {
    no: "01",
    time: "10 Okt 2023, 09:15",
    command: "Set Time",
    commandIcon: "schedule",
    deviceSn: "FINGERS-8822-X1",
    status: "Berhasil",
  },
  {
    no: "02",
    time: "10 Okt 2023, 08:30",
    command: "Restart",
    commandIcon: "restart_alt",
    deviceSn: "FINGERS-9933-A2",
    status: "Berhasil",
  },
  {
    no: "03",
    time: "09 Okt 2023, 17:45",
    command: "Set Time",
    commandIcon: "schedule",
    deviceSn: "FINGERS-8822-X1",
    status: "Gagal",
  },
  {
    no: "04",
    time: "09 Okt 2023, 14:20",
    command: "Update Firmware",
    commandIcon: "system_update",
    deviceSn: "FINGERS-1144-B3",
    status: "Menunggu",
  },
];

const statusStyles: Record<string, string> = {
  Berhasil: "bg-green-100 text-green-700",
  Gagal: "bg-red-100 text-red-700",
  Menunggu: "bg-surface-container-highest text-secondary italic",
};

export default function MesinPage() {
  const [currentTime, setCurrentTime] = useState("00:00:00");

  useEffect(() => {
    function tick() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setCurrentTime(`${h}:${m}:${s}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "transparent" }}>
      <Sidebar />
      <main className="ml-[68px] min-h-screen relative flex flex-col">
        <Topbar title="Mesin" />

        <div className="px-8 pt-6 pb-6 space-y-6">
          {/* Row 1: Config & Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Info Mesin & Atur Waktu */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary">schedule</span>
                <h3 className="text-[20px] leading-[28px] font-semibold text-primary">
                  Info Mesin & Atur Waktu
                </h3>
              </div>

              <div className="space-y-2">
                <label className="text-[14px] leading-[20px] font-semibold text-outline">
                  Serial Number Mesin
                </label>
                <div className="relative">
                  <select className="w-full h-12 px-4 bg-surface-container-low border border-outline-variant rounded-xl appearance-none focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all">
                    <option>FINGERS-8822-X1</option>
                    <option>FINGERS-9933-A2</option>
                    <option>FINGERS-1144-B3</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                  <p className="text-[10px] uppercase tracking-widest text-outline mb-1 font-bold">
                    Waktu Saat Ini
                  </p>
                  <p className="text-[48px] leading-[56px] tracking-tighter font-bold text-primary">
                    {currentTime}
                  </p>
                </div>
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                  <p className="text-[10px] uppercase tracking-widest text-outline mb-1 font-bold">
                    Zona Waktu
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-lg">
                      public
                    </span>
                    <p className="text-[16px] leading-[24px] font-bold text-primary">
                      GMT +07:00 (WIB)
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <label className="text-[14px] leading-[20px] font-semibold text-outline">
                  Sesuaikan Zona Waktu
                </label>
                <div className="relative">
                  <select className="w-full h-12 px-4 pr-10 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none">
                    <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                    <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                    <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
                </div>
              </div>

              <button className="w-full h-12 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-all active:scale-[0.98]">
                <span className="material-symbols-outlined">sync</span>
                Set Waktu & Sinkronisasi
              </button>
            </div>

            {/* Restart Mesin */}
            <div className="glass-card p-6 space-y-4 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-error">restart_alt</span>
                <h3 className="text-[20px] leading-[28px] font-semibold text-primary">
                  Restart Mesin
                </h3>
              </div>

              <div className="flex-1 space-y-4">
                <p className="text-[14px] leading-[20px] text-secondary">
                  Memulai ulang mesin akan memutuskan koneksi sementara. Pastikan tidak ada
                  aktivitas absensi saat melakukan tindakan ini.
                </p>

                <div className="space-y-2">
                  <label className="text-[14px] leading-[20px] font-semibold text-outline">
                    Pilih Mesin
                  </label>
                  <div className="relative">
                    <select className="w-full h-12 px-4 bg-surface-container-low border border-outline-variant rounded-xl appearance-none focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all">
                      <option>FINGERS-8822-X1 (Main Lobby)</option>
                      <option>FINGERS-9933-A2 (HR Room)</option>
                      <option>FINGERS-1144-B3 (Production)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                      expand_more
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-error-container/20 border border-error/10 rounded-xl flex flex-col items-center text-center gap-3">
                  <span className="material-symbols-outlined text-error text-3xl">
                    warning
                  </span>
                  <p className="text-error font-bold text-[14px] leading-[20px]">
                    Tindakan ini bersifat segera dan tidak dapat dibatalkan.
                  </p>
                  <button className="w-full h-12 bg-error text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] mt-2">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      power_settings_new
                    </span>
                    Restart Mesin Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: History Table */}
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-on-surface/[0.08] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">history</span>
                <h3 className="text-[20px] leading-[28px] font-semibold text-primary">
                  Riwayat Command Terbaru
                </h3>
              </div>
              <button className="px-4 py-2 border border-outline-variant rounded-full text-secondary flex items-center gap-2 hover:bg-surface-variant/30 transition-all text-[14px] leading-[20px] font-bold">
                <span className="material-symbols-outlined text-lg">filter_list</span>
                Filter Riwayat
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-outline uppercase text-[10px] tracking-widest font-bold">
                    <th className="px-6 py-4">No</th>
                    <th className="px-6 py-4">Waktu Execution</th>
                    <th className="px-6 py-4">Command</th>
                    <th className="px-6 py-4">Device SN</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-on-surface/[0.05]">
                  {historyData.map((row) => (
                    <tr key={row.no} className="hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4 text-secondary font-bold">{row.no}</td>
                      <td className="px-6 py-4 font-bold text-on-surface">{row.time}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-secondary">
                          <span className="material-symbols-outlined text-lg">
                            {row.commandIcon}
                          </span>
                          {row.command}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-secondary font-mono">
                        {row.deviceSn}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyles[row.status]}`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 flex justify-center border-t border-on-surface/[0.08]">
              <button className="text-primary font-bold text-[14px] leading-[20px] flex items-center gap-2 hover:underline">
                Lihat Semua Riwayat
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
