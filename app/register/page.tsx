"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch {
      setError("Terjadi kesalahan jaringan");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-container/10 rounded-full blur-3xl" />

        <div className="w-full max-w-md relative z-10">
          <Link href="/" className="flex items-center justify-center gap-3 mb-10">
            <Image src="/topsregnif.png" alt="Tops Reg Nif" width={48} height={48} className="rounded-xl" />
            <div className="flex flex-col">
              <span className="text-[24px] leading-[32px] font-bold text-primary">Tops Reg Nif</span>
              <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Attendance System</span>
            </div>
          </Link>

          <div className="glass-card p-8 rounded-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
            </div>
            <h1 className="text-[28px] leading-[36px] font-bold text-primary mb-2">Pendaftaran Berhasil!</h1>
            <p className="text-sm text-secondary mb-8">
              Akun Anda telah berhasil dibuat. Silakan masuk untuk mengakses dashboard.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold py-3 px-8 rounded-xl transition-all hover:bg-primary-container active:scale-95 shadow-lg shadow-primary/10"
            >
              <span>Masuk ke Dashboard</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-container/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-10">
          <Image src="/topsregnif.png" alt="Tops Reg Nif" width={48} height={48} className="rounded-xl" />
          <div className="flex flex-col">
            <span className="text-[24px] leading-[32px] font-bold text-primary">Tops Reg Nif</span>
            <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Attendance System</span>
          </div>
        </Link>

        {/* Register Card */}
        <div className="glass-card p-8 rounded-2xl">
          <div className="text-center mb-8">
            <h1 className="text-[28px] leading-[36px] font-bold text-primary mb-2">Buat Akun Baru</h1>
            <p className="text-sm text-secondary">Daftar untuk mengakses sistem absensi</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 flex items-center gap-3">
              <span className="material-symbols-outlined text-error text-lg">error</span>
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-[12px] font-semibold text-secondary uppercase tracking-wider mb-2">Nama Lengkap</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">person</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container/50 border border-on-surface/[0.08] text-[14px] text-primary placeholder:text-outline focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-secondary uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@perusahaan.com"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container/50 border border-on-surface/[0.08] text-[14px] text-primary placeholder:text-outline focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-secondary uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">lock</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  required
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-surface-container/50 border border-on-surface/[0.08] text-[14px] text-primary placeholder:text-outline focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-secondary transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">{showPassword ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-secondary uppercase tracking-wider mb-2">Konfirmasi Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">lock</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container/50 border border-on-surface/[0.08] text-[14px] text-primary placeholder:text-outline focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-3 rounded-xl transition-all hover:bg-primary-container active:scale-[0.98] shadow-lg shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Daftar</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-bold text-primary hover:text-primary-container transition-colors">
                Masuk
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
