"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { createClient } from "@/lib/supabase/client";

interface PinItem {
  id?: string;
  pin: string;
  device_sn: string;
  fetched_at?: string;
}

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
  const [pins, setPins] = useState<PinItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPins();
  }, []);

  const loadPins = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pins")
      .select("*")
      .order("fetched_at", { ascending: false });

    if (!error && data) {
      setPins(data);
    }
    setLoading(false);
  };

  const handleAmbilSemuaPin = async () => {
    setSyncing(true);
    setMessage("");
    try {
      const res = await fetch("/mesin/get-all-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trans_id: Date.now().toString() }),
      });

      const result = await res.json();

      if (result.success) {
        setMessage("Command dikirim ke mesin. Data akan muncul beberapa saat setelah diproses.");
        // Poll database setiap 2 detik untuk cek data baru
        let attempts = 0;
        const poll = setInterval(async () => {
          attempts++;
          await loadPins();
          const { data } = await createClient().from("pins").select("*");
          if ((data && data.length > 0) || attempts >= 10) {
            clearInterval(poll);
            if (data && data.length > 0) {
              setMessage(`Berhasil! ${data.length} PIN ditemukan di database.`);
            } else {
              setMessage("Timeout: Data belum muncul. Cek apakah Edge Function sudah ter-deploy.");
            }
            setTimeout(() => setMessage(""), 8000);
          }
        }, 2000);
      } else {
        const errorMsg = result.message || result.error || "Terjadi kesalahan tidak dikenal";
        setMessage(`Gagal: ${errorMsg}`);
      }
    } catch (err) {
      setMessage(`Error: ${err instanceof Error ? err.message : "Network error"}`);
    } finally {
      setSyncing(false);
    }
  };

  const filteredPins = pins.filter(
    (p) =>
      p.pin.includes(search) ||
      p.device_sn.toLowerCase().includes(search.toLowerCase())
  );

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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                onClick={handleAmbilSemuaPin}
                disabled={syncing}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-container active:scale-95 transition-all shadow-md shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className={`material-symbols-outlined text-lg ${syncing ? "animate-spin" : ""}`}>sync</span>
                <span className="text-[12px] leading-4 font-semibold whitespace-nowrap tracking-[0.05em]">
                  {syncing ? "Mengambil..." : "Ambil Semua PIN"}
                </span>
              </button>
            </div>
          </div>

          {/* Status Message */}
          {message && (
            <div className={`mb-4 px-4 py-3 rounded-xl text-[14px] font-medium ${
              message.startsWith("Gagal") || message.startsWith("Error")
                ? "bg-error/10 text-error"
                : "bg-green-50 text-green-700"
            }`}>
              {message}
            </div>
          )}

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
                      Device Serial Number
                    </th>
                    <th className="px-6 py-4 text-[12px] leading-4 font-semibold text-secondary uppercase tracking-wider">
                      Terakhir Diambil
                    </th>
                    <th className="px-6 py-4 text-[12px] leading-4 font-semibold text-secondary uppercase tracking-wider text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-on-surface/[0.03]">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-secondary">
                        <span className="material-symbols-outlined animate-spin text-3xl mb-2">progress_activity</span>
                        <p className="text-[14px]">Memuat data PIN...</p>
                      </td>
                    </tr>
                  ) : filteredPins.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-secondary">
                        <span className="material-symbols-outlined text-4xl mb-2 text-outline">key_off</span>
                        <p className="text-[14px]">
                          {pins.length === 0
                            ? "Belum ada data PIN. Klik \"Ambil Semua PIN\" untuk sinkronisasi."
                            : "PIN tidak ditemukan."}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredPins.map((row, idx) => (
                      <tr key={row.id ?? row.pin} className="hover:bg-surface-bright/50 transition-colors group">
                        <td className="px-6 py-4 text-center text-[14px] leading-5 text-secondary">
                          {String(idx + 1).padStart(2, "0")}
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
                        <td className="px-6 py-4 text-[14px] leading-5 text-secondary font-mono">
                          {row.device_sn || "-"}
                        </td>
                        <td className="px-6 py-4 text-[14px] leading-5 text-secondary">
                          {row.fetched_at
                            ? new Date(row.fetched_at).toLocaleString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between bg-surface-variant/10 border-t border-on-surface/[0.05]">
              <p className="text-secondary text-[12px] leading-4 font-semibold tracking-[0.05em]">
                Menampilkan {filteredPins.length} dari {pins.length} data PIN
              </p>
              <div className="flex items-center gap-2">
                <button className="p-1 rounded-lg border border-outline-variant text-secondary hover:bg-surface-variant transition-colors disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <div className="flex items-center">
                  <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white text-[12px] leading-4 font-semibold">
                    1
                  </span>
                </div>
                <button className="p-1 rounded-lg border border-outline-variant text-secondary hover:bg-surface-variant transition-colors disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bento Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  key
                </span>
              </div>
              <div>
                <p className="text-secondary text-[12px] leading-4 font-semibold uppercase tracking-[0.05em]">
                  Total PIN
                </p>
                <h4 className="text-[24px] leading-tight font-bold text-primary">
                  {pins.length}
                </h4>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-fixed-dim/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  devices
                </span>
              </div>
              <div>
                <p className="text-secondary text-[12px] leading-4 font-semibold uppercase tracking-[0.05em]">
                  Device Terdaftar
                </p>
                <h4 className="text-[24px] leading-tight font-bold text-primary">
                  {new Set(pins.map((p) => p.device_sn).filter(Boolean)).size}
                </h4>
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
