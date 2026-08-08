"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  const start = () => {
    if (started) return;
    setStarted(true);
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  return { count, start };
}

const features = [
  {
    icon: "fingerprint",
    title: "Integrasi Fingerspot",
    description: "Terhubung langsung dengan mesin absensi Fingerspot. Data kehadiran otomatis tercatat tanpa perlu input manual.",
  },
  {
    icon: "monitoring",
    title: "Monitoring Real-time",
    description: "Pantau kehadiran karyawan secara langsung dari dashboard. Setiap scan jari tercatat dalam hitungan detik.",
  },
  {
    icon: "settings_remote",
    title: "Kontrol Mesin Jarak Jauh",
    description: "Atur waktu, restart, dan kelola mesin absensi dari mana saja. Tidak perlu lagi datang ke lokasi mesin.",
  },
  {
    icon: "webhook",
    title: "Webhook & API",
    description: "Integrasikan dengan sistem lain melalui webhook dan API. Sinkronisasi data absensi otomatis ke HRIS atau payroll.",
  },
  {
    icon: "manage_accounts",
    title: "Manajemen User & PIN",
    description: "Kelola data karyawan, PIN, dan hak akses dalam satu tempat. Sinkronisasi langsung ke mesin absensi.",
  },
  {
    icon: "analytics",
    title: "Analytics Dashboard",
    description: "Visualisasi data kehadiran dengan chart dan statistik. Identifikasi pola absensi dan top performer tim Anda.",
  },
];

const steps = [
  {
    number: "01",
    icon: "link",
    title: "Hubungkan Mesin",
    description: "Daftarkan mesin Fingerspot Anda ke dalam sistem. Proses setup hanya butuh beberapa menit.",
  },
  {
    number: "02",
    icon: "tune",
    title: "Konfigurasi Webhook",
    description: "Atur webhook dan API endpoint untuk mengirim data absensi ke sistem lain secara otomatis.",
  },
  {
    number: "03",
    icon: "dashboard",
    title: "Pantau Dashboard",
    description: "Akses dashboard untuk melihat data kehadiran real-time, analytics, dan kelola seluruh aspek absensi.",
  },
];

const testimonials = [
  {
    name: "Budi Santoso",
    role: "HR Manager, PT Maju Jaya",
    content: "Sejak menggunakan Tops Reg Nif, pengelolaan absensi karyawan jadi jauh lebih mudah. Data real-time membantu kami mengambil keputusan lebih cepat.",
    avatar: "BS",
  },
  {
    name: "Siti Rahayu",
    role: "Operations Director, CV Berkah",
    content: "Integrasi dengan Fingerspot sangat mulus. Setup hanya butuh 10 menit dan langsung bisa digunakan. Sangat membantu operasional harian kami.",
    avatar: "SR",
  },
  {
    name: "Andi Pratama",
    role: "IT Supervisor, PT Sejahtera",
    content: "Fitur webhook-nya luar biasa. Data absensi otomatis terkirim ke sistem HR kami tanpa perlu intervensi manual. Efisiensi meningkat signifikan.",
    avatar: "AP",
  },
];

const stats = [
  { value: 500, suffix: "+", label: "Karyawan Terkelola" },
  { value: 50, suffix: "+", label: "Perusahaan Mitra" },
  { value: 99, suffix: "%", label: "Uptime System" },
  { value: 24, suffix: "/7", label: "Dukungan Teknis" },
];

const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
  e.preventDefault();
  const target = document.getElementById(targetId);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroSection = useScrollAnimation();
  const featuresSection = useScrollAnimation();
  const stepsSection = useScrollAnimation();
  const statsSection = useScrollAnimation();
  const testimonialSection = useScrollAnimation();
  const ctaSection = useScrollAnimation();

  const stat1 = useCountUp(500);
  const stat2 = useCountUp(50);
  const stat3 = useCountUp(99);
  const stat4 = useCountUp(24);

  useEffect(() => {
    if (statsSection.isVisible) {
      stat1.start();
      stat2.start();
      stat3.start();
      stat4.start();
    }
  }, [statsSection.isVisible]);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-[24px] border-b border-black/[0.06] shadow-[0_4px_32px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image src="/topsregnif.png" alt="Tops Reg Nif" width={40} height={40} className="rounded-lg" />
              <div className="flex flex-col">
                <span className="text-[20px] leading-[28px] font-bold text-primary">Tops Reg Nif</span>
                <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Attendance System</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" onClick={(e) => smoothScroll(e, "features")} className="text-sm font-semibold text-secondary hover:text-primary transition-colors cursor-pointer">Fitur</a>
              <a href="#how-it-works" onClick={(e) => smoothScroll(e, "how-it-works")} className="text-sm font-semibold text-secondary hover:text-primary transition-colors cursor-pointer">Cara Kerja</a>
              <a href="#testimonials" onClick={(e) => smoothScroll(e, "testimonials")} className="text-sm font-semibold text-secondary hover:text-primary transition-colors cursor-pointer">Testimoni</a>
              <Link
                href="/login"
                className="bg-primary text-white font-bold py-2.5 px-6 rounded-xl transition-all hover:bg-primary-container active:scale-95 shadow-lg shadow-primary/10"
              >
                Login
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant/50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="material-symbols-outlined text-secondary">{mobileMenuOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-card border-t border-black/[0.06]">
            <div className="px-6 py-4 space-y-3">
              <a href="#features" className="block text-sm font-semibold text-secondary hover:text-primary transition-colors py-2" onClick={(e) => { smoothScroll(e, "features"); setMobileMenuOpen(false); }}>Fitur</a>
              <a href="#how-it-works" className="block text-sm font-semibold text-secondary hover:text-primary transition-colors py-2" onClick={(e) => { smoothScroll(e, "how-it-works"); setMobileMenuOpen(false); }}>Cara Kerja</a>
              <a href="#testimonials" className="block text-sm font-semibold text-secondary hover:text-primary transition-colors py-2" onClick={(e) => { smoothScroll(e, "testimonials"); setMobileMenuOpen(false); }}>Testimoni</a>
              <Link
                href="/login"
                className="block bg-primary text-white font-bold py-2.5 px-6 rounded-xl text-center transition-all hover:bg-primary-container active:scale-95 shadow-lg shadow-primary/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-10 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-container/10 rounded-full blur-3xl" />

        <div
          ref={heroSection.ref}
          className={`max-w-7xl mx-auto text-center relative z-10 transition-all duration-1000 ${
            heroSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-8">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-secondary">Sistem Absensi Terintegrasi Fingerspot</span>
          </div>

          <h1 className="text-[48px] md:text-[64px] lg:text-[72px] leading-[1.1] font-bold text-primary mb-6 tracking-[-0.02em]">
            Pantau Kehadiran
            <br />
            <span className="text-secondary">Secara Real-time</span>
          </h1>

          <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Sistem dashboard cerdas yang terhubung langsung dengan mesin Fingerspot. Kendalikan mesin absensi, pantau data kehadiran, dan kelola seluruh aspek attendance dalam satu tempat.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="bg-primary text-white font-bold py-3.5 px-8 rounded-xl transition-all hover:bg-primary-container active:scale-95 shadow-lg shadow-primary/10 flex items-center gap-2"
            >
              <span>Mulai Sekarang</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
            <a
              href="#features"
              onClick={(e) => smoothScroll(e, "features")}
              className="glass-card bg-transparent hover:bg-surface-variant/30 text-primary font-bold py-3.5 px-8 rounded-xl transition-all active:scale-95 border border-on-surface/[0.08] flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">info</span>
              <span>Pelajari Lebih Lanjut</span>
            </a>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="glass-card p-2 rounded-2xl shadow-2xl shadow-primary/10">
              <div className="bg-surface-container rounded-xl overflow-hidden">
                {/* Mock dashboard header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-outline-variant/20">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs font-semibold text-secondary">Dashboard Preview</span>
                  </div>
                </div>
                {/* Mock content */}
                <div className="p-6 grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="glass-card p-4 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 mb-3" />
                      <div className="h-3 bg-outline-variant/30 rounded w-20 mb-2" />
                      <div className="h-6 bg-primary/20 rounded w-12" />
                    </div>
                  ))}
                </div>
                <div className="px-6 pb-6 grid grid-cols-3 gap-4">
                  <div className="col-span-2 glass-card p-4 rounded-xl h-32">
                    <div className="h-3 bg-outline-variant/30 rounded w-24 mb-4" />
                    <div className="flex items-end gap-2 h-16">
                      {[40, 60, 30, 80, 50, 70, 45].map((h, i) => (
                        <div key={i} className="flex-1 bg-primary/30 rounded-t" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="glass-card p-4 rounded-xl h-32">
                    <div className="h-3 bg-outline-variant/30 rounded w-20 mb-4" />
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10" />
                          <div className="h-2 bg-outline-variant/30 rounded flex-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 lg:px-10">
        <div
          ref={statsSection.ref}
          className={`max-w-7xl mx-auto transition-all duration-1000 ${
            statsSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { count: stat1.count, suffix: "+", label: "Karyawan Terkelola" },
              { count: stat2.count, suffix: "+", label: "Perusahaan Mitra" },
              { count: stat3.count, suffix: "%", label: "Uptime System" },
              { count: stat4.count, suffix: "/7", label: "Dukungan Teknis" },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6 rounded-xl text-center hover:scale-[1.02] transition-transform">
                <p className="text-[36px] md:text-[48px] leading-[56px] tracking-[-0.02em] font-bold text-primary">
                  {stat.count}{stat.suffix}
                </p>
                <p className="text-sm font-semibold text-secondary mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 lg:px-10 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div
          ref={featuresSection.ref}
          className={`max-w-7xl mx-auto relative z-10 transition-all duration-1000 ${
            featuresSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-[36px] md:text-[48px] leading-[1.1] font-bold text-primary mb-4 tracking-[-0.02em]">
              Fitur Unggulan
            </h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              Solusi lengkap untuk mengelola absensi karyawan dengan teknologi Fingerspot yang terintegrasi langsung ke dashboard Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="glass-card p-6 rounded-xl hover:scale-[1.02] transition-transform group cursor-default"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 lg:px-10">
        <div
          ref={stepsSection.ref}
          className={`max-w-7xl mx-auto transition-all duration-1000 ${
            stepsSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-[36px] md:text-[48px] leading-[1.1] font-bold text-primary mb-4 tracking-[-0.02em]">
              Cara Kerja
            </h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              Tiga langkah sederhana untuk memulai sistem absensi cerdas di perusahaan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[calc(50%+60px)] w-[calc(100%-120px)] h-[2px] bg-outline-variant/30" />
                )}
                <div className="glass-card p-8 rounded-xl text-center relative z-10 hover:scale-[1.02] transition-transform">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 relative">
                    <span className="material-symbols-outlined text-primary text-4xl">{step.icon}</span>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">{step.title}</h3>
                  <p className="text-sm text-secondary leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 lg:px-10 relative">
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary-container/10 rounded-full blur-3xl" />

        <div
          ref={testimonialSection.ref}
          className={`max-w-7xl mx-auto relative z-10 transition-all duration-1000 ${
            testimonialSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-[36px] md:text-[48px] leading-[1.1] font-bold text-primary mb-4 tracking-[-0.02em]">
              Apa Kata Mereka?
            </h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              Dipercaya oleh berbagai perusahaan untuk mengelola sistem absensi karyawan mereka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => {
              const avatarColors = [
                { bg: "bg-primary-fixed", text: "text-primary" },
                { bg: "bg-secondary-container", text: "text-secondary" },
                { bg: "bg-tertiary-fixed", text: "text-tertiary" },
              ];
              const color = avatarColors[i % avatarColors.length];
              return (
                <div
                  key={i}
                  className="glass-card p-6 rounded-xl hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="material-symbols-outlined text-yellow-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="text-sm text-secondary leading-relaxed mb-6">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${color.bg} flex items-center justify-center`}>
                      <span className={`text-sm font-bold ${color.text}`}>{testimonial.avatar}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">{testimonial.name}</p>
                      <p className="text-xs text-secondary">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-10">
        <div
          ref={ctaSection.ref}
          className={`max-w-4xl mx-auto transition-all duration-1000 ${
            ctaSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="glass-card p-12 rounded-2xl text-center relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-[36px] md:text-[48px] leading-[1.1] font-bold text-primary mb-4 tracking-[-0.02em]">
                Siap Memulai?
              </h2>
              <p className="text-lg text-secondary max-w-xl mx-auto mb-8">
                Akses dashboard sekarang dan kelola sistem absensi karyawan Anda dengan lebih cerdas dan efisien.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-primary text-white font-bold py-3.5 px-8 rounded-xl transition-all hover:bg-primary-container active:scale-95 shadow-lg shadow-primary/10"
              >
                <span>Masuk ke Dashboard</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 lg:px-10 border-t border-outline-variant/20 bg-surface-container/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <Image src="/topsregnif.png" alt="Tops Reg Nif" width={32} height={32} className="rounded-lg" />
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-primary">Tops Reg Nif</span>
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Attendance System</span>
                </div>
              </div>
              <p className="text-sm text-secondary leading-relaxed mb-4">
                Sistem dashboard cerdas untuk mengelola absensi karyawan dengan teknologi Fingerspot yang terintegrasi langsung ke dalam satu platform.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="w-9 h-9 rounded-full glass-card flex items-center justify-center hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-secondary text-lg">mail</span>
                </a>
                <a href="#" className="w-9 h-9 rounded-full glass-card flex items-center justify-center hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-secondary text-lg">call</span>
                </a>
                <a href="#" className="w-9 h-9 rounded-full glass-card flex items-center justify-center hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-secondary text-lg">location_on</span>
                </a>
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Produk</h3>
              <ul className="space-y-3">
                <li><a href="#features" onClick={(e) => smoothScroll(e, "features")} className="text-sm text-secondary hover:text-primary transition-colors">Fitur</a></li>
                <li><a href="#how-it-works" onClick={(e) => smoothScroll(e, "how-it-works")} className="text-sm text-secondary hover:text-primary transition-colors">Cara Kerja</a></li>
                <li><Link href="/login" className="text-sm text-secondary hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link href="/register" className="text-sm text-secondary hover:text-primary transition-colors">Daftar</Link></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Perusahaan</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-secondary hover:text-primary transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="text-sm text-secondary hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-secondary hover:text-primary transition-colors">Karir</a></li>
                <li><a href="#" className="text-sm text-secondary hover:text-primary transition-colors">Kontak</a></li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Kontak</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-secondary text-lg mt-0.5">location_on</span>
                  <span className="text-sm text-secondary">Prapatan Mekkah</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-lg">mail</span>
                  <span className="text-sm text-secondary">support@topsregnif.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-lg">call</span>
                  <span className="text-sm text-secondary">+62 12 3456 6789</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-secondary">
              &copy; 2026 Tops Reg Nif. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-secondary hover:text-primary transition-colors">Kebijakan Privasi</a>
              <a href="#" className="text-xs text-secondary hover:text-primary transition-colors">Syarat & Ketentuan</a>
              <a href="#" className="text-xs text-secondary hover:text-primary transition-colors">Bantuan</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
