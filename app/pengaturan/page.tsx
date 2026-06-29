"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { createClient } from "@/lib/supabase/client";

export default function PengaturanPage() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showWebhook, setShowWebhook] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cloudId, setCloudId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("settings").select("key, value");
      if (data) {
        data.forEach((s) => {
          if (s.key === "cloud_id") setCloudId(s.value);
          if (s.key === "api_key") setApiKey(s.value);
          if (s.key === "webhook_secret") setWebhookSecret(s.value);
        });
      }
    };
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSaveMessage("");

    const supabase = createClient();
    const { error } = await supabase.from("settings").upsert(
      [
        { key: "cloud_id", value: cloudId },
        { key: "api_key", value: apiKey },
        { key: "webhook_secret", value: webhookSecret },
      ],
      { onConflict: "key" }
    );

    setIsSubmitting(false);
    setSaveMessage(error ? `Gagal: ${error.message}` : "Berhasil disimpan");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "transparent" }}>
      <Sidebar />
      <main className="ml-[68px] min-h-screen relative flex flex-col">
        <Topbar title="Pengaturan" />
        <div className="px-8 flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="w-full max-w-2xl">
            <div className="glass-card rounded-2xl p-10 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="mb-10 text-center">
                  <h3 className="text-[32px] leading-[40px] tracking-[-0.01em] font-semibold text-primary mb-2">
                    Konfigurasi Sistem
                  </h3>
                  <p className="text-secondary text-[16px] leading-6">
                    Kelola integrasi API dan parameter sinkronisasi Cloud.
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          value={cloudId}
                          onChange={(e) => setCloudId(e.target.value)}
                          placeholder="FS-9988-CLOUD"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant/30 bg-white/40 backdrop-blur-sm focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all text-[16px] leading-6"
                        />
                      </div>
                    </div>

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
                          value={webhookSecret}
                          onChange={(e) => setWebhookSecret(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant/30 bg-white/40 backdrop-blur-sm focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all text-[16px] leading-6"
                        />
                      </div>
                    </div>
                  </div>

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
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
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
                  {saveMessage && (
                    <p className="text-center text-sm font-medium text-primary">
                      {saveMessage}
                    </p>
                  )}
                </form>
              </div>
            </div>

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
