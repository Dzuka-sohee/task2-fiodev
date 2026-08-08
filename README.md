# Tops Reg Nif - Fingerprint Attendance System Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
</p>

Dashboard integrasi sistem absensi fingerprint Fingerspot. Menghubungkan mesin absensi Fingerspot dengan database Supabase melalui Fingerspot Cloud API.

## Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4
- **Backend:** Next.js API Routes, Supabase PostgreSQL
- **Auth:** Custom JWT (jose) + bcryptjs
- **Integrasi:** Fingerspot Cloud API (developer.fingerspot.io)

---

## Setup

### 1. Clone Repository

```bash
git clone https://github.com/username/task2-fiodev.git
cd task2-fiodev
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

1. Buat project baru di [Supabase](https://supabase.com)
2. Buka **SQL Editor** di dashboard Supabase
3. Jalankan seluruh isi file `FioDev.sql` untuk membuat semua tabel dan fungsi yang dibutuhkan
4. Jalankan juga `supabase/migrate_settings_table.sql` untuk membuat tabel settings

### 4. Konfigurasi Environment Variables

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-supabase>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key-supabase>
JWT_SECRET=<rahasia-jwt-sendiri>
```

| Variable | Deskripsi | Dapat dari |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase | Dashboard Supabase > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon/public key | Dashboard Supabase > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (rahasia) | Dashboard Supabase > Settings > API |
| `JWT_SECRET` | Secret key untuk JWT | Buat sendiri (bebas) |

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka http://localhost:3000 di browser.

### 6. Register Akun Pertama

Buka http://localhost:3000/register dan buat akun baru. Akun ini akan digunakan untuk login ke dashboard.

---

## Penggunaan Program

### Langkah 1: Konfigurasi Fingerspot Cloud

1. Buka [developer.fingerspot.io](https://developer.fingerspot.io)
2. Login dengan akun Fingerspot Anda
3. Pastikan mesin absensi sudah terdaftar di portal
4. Catat **Cloud ID** dan **API Key** dari portal

### Langkah 2: Isi Pengaturan di Dashboard

1. Login ke dashboard di http://localhost:3000/login
2. Buka menu **Pengaturan** (ikon gear di sidebar)
3. Klik **Edit Settings**
4. Isi field berikut:
   - **Cloud ID** — ID cloud dari portal Fingerspot
   - **API Key** — API key dari portal Fingerspot
   - **Webhook Secret** — secret untuk validasi webhook (sesuaikan di portal Fingerspot)
   - **Device Timezone** — `Asia/Jakarta` (WIB), `Asia/Makassar` (WITA), atau `Asia/Jayapura` (WIT)
5. Klik **Simpan**

### Langkah 3: Get All Pin (Ambil Semua PIN)

1. Buka menu **Data PIN** di sidebar
2. Klik tombol **Fetch All PINs**
3. Tunggu beberapa saat — PIN yang terdaftar di mesin akan muncul di tabel
4. Data ini dikirim ke Fingerspot Cloud API, hasilnya akan masuk via webhook

### Langkah 4: Get User Info (Ambil Data User)

1. Buka menu **Data User** di sidebar
2. Centang PIN yang ingin diambil datanya
3. Klik tombol **Sync dari Device** (ikon sync)
4. Data nama, privilege, dan informasi lainnya akan terisi dari mesin

### Langkah 5: Coba Absen (Tes Attendance)

1. Pada mesin fingerprint, letakkan jari atau gunakan kartu untuk melakukan absen
2. Data absensi akan masuk ke database melalui webhook dari Fingerspot Cloud
3. Buka menu **Data Absensi** di sidebar untuk melihat log absensi yang masuk
4. Bisa juga klik **Fetch from Device** untuk mengambil log absensi langsung dari mesin

### Langkah 6: Tes Set Time (Sinkronisasi Waktu)

1. Buka menu **Mesin** di sidebar
2. Di panel **Set Time / Sync Waktu**, pilih timezone yang sesuai (WIB/WITA/WIT)
3. Klik tombol **Set Time**
4. Waktu pada mesin akan disinkronkan dengan waktu server
5. Perintah akan tercatat di tabel **Command History**

### Langkah 7: Tes Restart Mesin

1. Buka menu **Mesin** di sidebar
2. Di panel **Restart Mesin**, klik tombol **Restart**
3. Mesin akan melakukan restart secara remote
4. Perintah akan tercatat di tabel **Command History**

---

## Fitur Lainnya

| Halaman | Fungsi |
|---|---|
| **Dashboard** | Ringkasan statistik: absensi hari ini, total karyawan, tren 30 hari, top performer |
| **Data Absensi** | Log seluruh scan absensi dengan filter tanggal, pencarian, dan export CSV |
| **Mesin** | Set time dan restart mesin dari jarak jauh |
| **Data User** | CRUD user mesin + registrasi biometric (fingerprint, face, vein) |
| **Data PIN** | Lihat semua PIN yang terdaftar di mesin |
| **Webhook** | Monitoring semua event webhook yang masuk |
| **API Logs** | Log semua request API yang dikirim dan diterima |
| **Pengaturan** | Konfigurasi Cloud ID, API Key, Webhook Secret, Timezone |

---

## Arsitektur

```
Browser → Next.js App (proxy.ts middleware)
  ├── /api/auth/*      → Autentikasi (bcrypt + JWT)
  ├── /api/dashboard   → Data dashboard
  ├── /mesin/*         → Perintah mesin → callFingerspot() → Fingerspot Cloud API (HTTPS)
  └── /absensi, /user, /pin, dll → Supabase PostgreSQL (langsung dari browser)

Fingerspot Cloud API → Webhook → Supabase webhook_logs table
```

---

## Database Tables

| Tabel | Fungsi |
|---|---|
| `users` | User dashboard (operator) |
| `userinfos` | User dari mesin fingerprint |
| `pins` | PIN terdaftar di mesin |
| `attlogs` | Log absensi |
| `api_requests` | Log request API keluar |
| `command_logs` | Riwayat perintah ke mesin |
| `webhook_logs` | Event webhook masuk |
| `settings` | Konfigurasi sistem (cloud_id, api_key, dll) |

---

## Troubleshooting

| Masalah | Solusi |
|---|---|
| "Cloud ID belum dikonfigurasi" | Buka Pengaturan, isi Cloud ID dari portal Fingerspot |
| "API Key belum dikonfigurasi" | Buka Pengaturan, isi API Key dari portal Fingerspot |
| Webhook tidak masuk | Pastikan Webhook Secret di dashboard cocok dengan di portal Fingerspot |
| Absensi tidak muncul | Klik **Fetch from Device** di halaman Data Absensi, atau cek apakah webhook sudah terkonfigurasi |
| Mesin tidak merespon | Pastikan mesin online dan terhubung ke internet, cek Cloud ID benar |
