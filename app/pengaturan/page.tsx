"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { createClient } from "@/lib/supabase/client";

interface SettingsRow {
  id: string;
  cloud_id: string;
  webhook_secret: string;
  device_timezone: string;
  api_key: string;
  updated_at: string;
}

export default function PengaturanPage() {
  const [settings, setSettings] = useState<SettingsRow | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [showWebhook, setShowWebhook] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("settings").select("*").limit(1).single();
    if (data) {
      setSettings(data);
      setEditValues({
        cloud_id: data.cloud_id || "",
        webhook_secret: data.webhook_secret || "",
        device_timezone: data.device_timezone || "",
        api_key: data.api_key || "",
      });
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setSaveMessage("");
    const supabase = createClient();

    const { error } = await supabase.from("settings").update({
      cloud_id: editValues.cloud_id,
      api_key: editValues.api_key,
      webhook_secret: editValues.webhook_secret,
      device_timezone: editValues.device_timezone,
      updated_at: new Date().toISOString(),
    }).eq("id", settings?.id);

    setIsSubmitting(false);
    setIsEditing(false);
    setSaveMessage(error ? `Gagal: ${error.message}` : "Berhasil disimpan");
    setTimeout(() => setSaveMessage(""), 3000);
    await loadSettings();
  };

  const columns = [
    { key: "cloud_id", label: "Cloud ID", icon: "cloud" },
    { key: "webhook_secret", label: "Webhook Secret", icon: "key", secret: true },
    { key: "device_timezone", label: "Device Timezone", icon: "schedule" },
    { key: "api_key", label: "API Key", icon: "vpn_key", secret: true },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "transparent" }}>
      <Sidebar />
      <main className="ml-[68px] min-h-screen relative flex flex-col">
        <Topbar title="Pengaturan" />
        <div className="p-6 lg:p-10 flex flex-col gap-6">
          {/* Header */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-[32px] leading-10 tracking-tight font-semibold text-primary">
                Pengaturan Sistem
              </h1>
              <p className="text-[16px] leading-6 text-secondary">
                Konfigurasi integrasi API dan parameter Cloud.
              </p>
            </div>
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => { setIsEditing(false); setSaveMessage(""); }}
                    className="px-6 py-2.5 rounded-xl border border-outline-variant/40 text-secondary font-bold text-[14px] hover:bg-surface-variant/30 transition-all active:scale-95"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-[14px] shadow-lg shadow-primary/10 hover:bg-primary-container transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? "Menyimpan..." : "Simpan"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-[14px] shadow-lg shadow-primary/10 hover:bg-primary-container transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px] mr-1 align-middle">edit</span>
                  Edit Settings
                </button>
              )}
            </div>
          </section>

          {saveMessage && (
            <div className={`px-4 py-3 rounded-xl text-[14px] font-medium ${
              saveMessage.includes("Gagal") ? "bg-error/10 text-error" : "bg-green-50 text-green-700"
            }`}>
              {saveMessage}
            </div>
          )}

          {/* Settings Table */}
          <section className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high/40 border-b border-outline-variant/20">
                    {columns.map((col) => (
                      <th key={col.key} className="px-6 py-4 text-[12px] font-semibold text-secondary uppercase tracking-widest">
                        {col.label}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-[12px] font-semibold text-secondary uppercase tracking-widest">
                      Updated At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-outline-variant/10">
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4">
                        {isEditing ? (
                          <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                              {col.icon}
                            </span>
                            <input
                              type={col.secret && !(col.key === "api_key" ? showApiKey : showWebhook) ? "password" : "text"}
                              value={editValues[col.key] || ""}
                              onChange={(e) => setEditValues({ ...editValues, [col.key]: e.target.value })}
                              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface-container/50 border border-on-surface/[0.08] text-[14px] text-primary focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all"
                            />
                            {col.secret && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (col.key === "api_key") setShowApiKey(!showApiKey);
                                  else setShowWebhook(!showWebhook);
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                              >
                                <span className="material-symbols-outlined text-lg">
                                  {(col.key === "api_key" ? showApiKey : showWebhook) ? "visibility_off" : "visibility"}
                                </span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-outline text-lg">{col.icon}</span>
                            <code className="text-[14px] font-mono text-primary">
                              {col.secret ? "••••••••••••" : (settings?.[col.key as keyof SettingsRow] || "-")}
                            </code>
                            {col.secret && (
                              <button
                                onClick={() => {
                                  if (col.key === "api_key") setShowApiKey(!showApiKey);
                                  else setShowWebhook(!showWebhook);
                                }}
                                className="text-outline hover:text-primary transition-colors"
                              >
                                <span className="material-symbols-outlined text-lg">
                                  {(col.key === "api_key" ? showApiKey : showWebhook) ? "visibility_off" : "visibility"}
                                </span>
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-[14px] text-secondary">
                      {settings?.updated_at
                        ? new Date(settings.updated_at).toLocaleString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Info */}
          <section className="glass-card rounded-2xl p-4 flex items-start gap-4">
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
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
