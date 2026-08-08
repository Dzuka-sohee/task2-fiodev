"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan");
      setLoading(false);
    }
  };

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

        {/* Login Card */}
        <div className="glass-card p-8 rounded-2xl">
          <div className="text-center mb-8">
            <h1 className="text-[28px] leading-[36px] font-bold text-primary mb-2">Selamat Datang</h1>
            <p className="text-sm text-secondary">Masuk ke dashboard untuk mengelola absensi</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 flex items-center gap-3">
              <span className="material-symbols-outlined text-error text-lg">error</span>
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
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
                  placeholder="Masukkan password"
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
                  <span>Masuk</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary">
              Belum punya akun?{" "}
              <Link href="/register" className="font-bold text-primary hover:text-primary-container transition-colors">
                Daftar Sekarang
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
