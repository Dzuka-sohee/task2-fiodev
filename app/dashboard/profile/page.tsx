"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    fetch("/api/auth/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setFullName(data.user.full_name);
          setEmail(data.user.email);
          setRole(data.user.role === "admin" ? "Administrator" : "User");
          setCreatedAt(new Date(data.user.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error });
      } else {
        setMessage({ type: "success", text: "Profile berhasil diupdate" });
        // Refresh the page to update Topbar
        window.location.reload();
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPassword(true);
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Password baru tidak cocok" });
      setChangingPassword(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Password baru minimal 6 karakter" });
      setChangingPassword(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordMessage({ type: "error", text: data.error });
      } else {
        setPasswordMessage({ type: "success", text: "Password berhasil diubah" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPasswordMessage({ type: "error", text: "Terjadi kesalahan jaringan" });
    } finally {
      setChangingPassword(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-[68px] min-h-screen">
        <Topbar title="Edit Profile" />
        <div className="p-6 lg:p-10 space-y-6">
          {loading ? (
            <div className="glass-card p-12 rounded-xl text-center">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
              <p className="text-secondary mt-4">Memuat data profile...</p>
            </div>
          ) : (
            <>
              {/* Profile Info Card */}
              <div className="glass-card p-8 rounded-xl">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-primary-fixed flex items-center justify-center border-2 border-primary/10">
                    <span className="text-2xl font-bold text-primary">{getInitials(fullName)}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary">{fullName}</h3>
                    <p className="text-sm text-secondary">{email}</p>
                    <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">{role}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-4 rounded-xl bg-surface-container/50">
                    <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Tanggal Bergabung</p>
                    <p className="text-sm font-bold text-primary">{createdAt}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container/50">
                    <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Status Akun</p>
                    <p className="text-sm font-bold text-green-600">Aktif</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile}>
                  <h4 className="text-[16px] font-bold text-primary mb-4">Informasi Profile</h4>

                  {message && (
                    <div className={`mb-4 p-4 rounded-xl flex items-center gap-3 ${message.type === "success" ? "bg-green-500/10 border border-green-500/20" : "bg-error/10 border border-error/20"}`}>
                      <span className={`material-symbols-outlined text-lg ${message.type === "success" ? "text-green-600" : "text-error"}`}>
                        {message.type === "success" ? "check_circle" : "error"}
                      </span>
                      <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-error"}`}>{message.text}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-secondary uppercase tracking-wider mb-2">Nama Lengkap</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-surface-container/50 border border-on-surface/[0.08] text-[14px] text-primary focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-secondary uppercase tracking-wider mb-2">Email</label>
                      <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full px-4 py-3 rounded-xl bg-surface-container/30 border border-on-surface/[0.08] text-[14px] text-outline cursor-not-allowed"
                      />
                      <p className="text-xs text-secondary mt-1">Email tidak dapat diubah</p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-primary text-white font-bold py-2.5 px-6 rounded-xl transition-all hover:bg-primary-container active:scale-95 shadow-lg shadow-primary/10 disabled:opacity-50 flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">save</span>
                          <span>Simpan Perubahan</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Change Password Card */}
              <div className="glass-card p-8 rounded-xl">
                <h4 className="text-[16px] font-bold text-primary mb-6">Ganti Password</h4>

                <form onSubmit={handleChangePassword}>
                  {passwordMessage && (
                    <div className={`mb-4 p-4 rounded-xl flex items-center gap-3 ${passwordMessage.type === "success" ? "bg-green-500/10 border border-green-500/20" : "bg-error/10 border border-error/20"}`}>
                      <span className={`material-symbols-outlined text-lg ${passwordMessage.type === "success" ? "text-green-600" : "text-error"}`}>
                        {passwordMessage.type === "success" ? "check_circle" : "error"}
                      </span>
                      <p className={`text-sm ${passwordMessage.type === "success" ? "text-green-600" : "text-error"}`}>{passwordMessage.text}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-secondary uppercase tracking-wider mb-2">Password Lama</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">lock</span>
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Masukkan password lama"
                          required
                          className="w-full pl-12 pr-12 py-3 rounded-xl bg-surface-container/50 border border-on-surface/[0.08] text-[14px] text-primary placeholder:text-outline focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-secondary transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">{showCurrentPassword ? "visibility_off" : "visibility"}</span>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-secondary uppercase tracking-wider mb-2">Password Baru</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">lock</span>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimal 6 karakter"
                          required
                          className="w-full pl-12 pr-12 py-3 rounded-xl bg-surface-container/50 border border-on-surface/[0.08] text-[14px] text-primary placeholder:text-outline focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-secondary transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">{showNewPassword ? "visibility_off" : "visibility"}</span>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-secondary uppercase tracking-wider mb-2">Konfirmasi Password Baru</label>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Ulangi password baru"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-surface-container/50 border border-on-surface/[0.08] text-[14px] text-primary placeholder:text-outline focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="bg-primary text-white font-bold py-2.5 px-6 rounded-xl transition-all hover:bg-primary-container active:scale-95 shadow-lg shadow-primary/10 disabled:opacity-50 flex items-center gap-2"
                    >
                      {changingPassword ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Mengubah...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">lock</span>
                          <span>Ganti Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
