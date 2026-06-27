"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function PengaturanPage() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showWebhook, setShowWebhook] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "transparent" }}>
      <Sidebar />
      <main className="ml-[68px] min-h-screen relative flex flex-col">
        <Topbar title="Pengaturan" />
        <div className="px-8 flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="w-full max-w-2xl">
            {/* Settings Form Card */}
            <div className="glass-card rounded-2xl p-10 relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />

              <div className="relative z-10">
                {/* Header */}
                <div className="mb-10 text-center">
                  <h3 className="text-[32px] leading-[40px] tracking-[-0.01em] font-semibold text-primary mb-2">
                    Konfigurasi Sistem
                  </h3>
                  <p className="text-secondary text-[16px] leading-6">
                    Kelola integrasi API dan parameter sinkronisasi Cloud.
                  </p>
                </div>

                {/* Form */}
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsSubmitting(true);
                    setTimeout(() => {
                      setIsSubmitting(false);
                    }, 2000);
                  }}
                >
                  {/* Cloud ID & Webhook Secret */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cloud ID */}
                    <div>
                      <label className="block text-[12px] font-semibold text-primary mb-2 uppercase tracking-wider">
                        Cloud ID
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                          cloud
                        </span>
                        <input
                          type="text"
                          placeholder="FS-9988-CLOUD"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant/30 bg-white/40 backdrop-blur-sm focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all text-[16px] leading-6"
                        />
                      </div>
                    </div>

                    {/* Webhook Secret */}
                    <div>
                      <label className="block text-[12px] font-semibold text-primary mb-2 uppercase tracking-wider">
                        Webhook Secret
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                          key
                        </span>
                        <input
                          type={showWebhook ? "text" : "password"}
                          placeholder="••••••••••••"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant/30 bg-white/40 backdrop-blur-sm focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all text-[16px] leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  {/* API Key */}
                  <div>
                    <label className="block text-[12px] font-semibold text-primary mb-2 uppercase tracking-wider">
                      API Key
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                        vpn_key
                      </span>
                      <input
                        type={showApiKey ? "text" : "password"}
                        defaultValue="ak_live_51M9pUuD3kZ2j8L0x"
                        className="w-full pl-12 pr-12 py-3 rounded-xl border border-outline-variant/30 bg-white/40 backdrop-blur-sm focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all text-[16px] leading-6"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined">
                          {showApiKey ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Action Row */}
                  <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-outline-variant/20">
                    <div className="flex items-center gap-4 order-2 sm:order-1">
                      <button
                        type="button"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl border border-outline-variant/40 bg-surface/30 backdrop-blur-md text-primary font-bold text-[16px] leading-6 transition-all hover:-translate-y-0.5 hover:brightness-105 active:scale-[0.98]"
                      >
                        <span className="material-symbols-outlined">
                          network_check
                        </span>
                        Test Koneksi
                      </button>
                      {/* Status Badge */}
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">
                          Terhubung
                        </span>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="order-1 sm:order-2 w-full sm:w-auto px-12 py-3 rounded-xl bg-primary text-white font-bold text-[16px] leading-6 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:brightness-105 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Info Module */}
            <div className="mt-6 glass-card rounded-2xl p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined">info</span>
              </div>
              <div>
                <h4 className="font-bold text-primary text-[16px] leading-6">
                  Dokumentasi API
                </h4>
                <p className="text-secondary text-[14px] leading-5 mt-1">
                  Gunakan konfigurasi di atas untuk menghubungkan server lokal
                  Anda dengan layanan Cloud Fingerspot. Pastikan Webhook Secret
                  sesuai dengan yang terdaftar di portal pengembang.
                </p>
                <a
                  href="#"
                  className="inline-block mt-2 text-primary font-bold text-[14px] leading-5 hover:underline"
                >
                  Pelajari selengkapnya →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
