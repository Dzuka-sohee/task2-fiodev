# ⚙️ vibe_code.md – Backend Implementation
> Stack: Next.js 14+ App Router + TypeScript + Supabase
> Referensi API: https://developer.fingerspot.io/customer/api
> Prerequisite: UI halaman sudah selesai (lihat PLAN.md)

---

## 🔑 Environment Variables

Buat file `.env.local` di root project dan isi bagian berikut sebelum memulai:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
WEBHOOK_SECRET=
```

> `api_key`, `cloud_id`, dan `webhook_secret` **tidak** disimpan di `.env.local` — melainkan di tabel `settings` Supabase dan dikelola dari halaman Pengaturan.

---

## 🗄️ STEP 1 — Database Schema (Supabase)

Buka **Supabase Dashboard → SQL Editor**, lalu buat tabel-tabel berikut satu per satu:

### Tabel `attlogs`
Menyimpan setiap data scan absensi dari mesin.
Kolom: `id`, `pin`, `user_name`, `scan_time`, `verify_type`, `status_code`, `device_sn`, `raw_payload`, `created_at`
Buat index pada kolom `scan_time DESC` dan `pin`.

### Tabel `userinfos`
Menyimpan data karyawan yang tersinkronisasi dari mesin.
Kolom: `id`, `pin` (unique), `name`, `password`, `card_no`, `privilege`, `enabled`, `device_sn`, `raw_payload`, `synced_at`, `created_at`, `updated_at`

### Tabel `pins`
Menyimpan daftar PIN/User ID yang ada di mesin.
Kolom: `id`, `pin`, `device_sn`, `fetched_at`

### Tabel `api_requests`
Menyimpan riwayat setiap request yang dikirim ke Fingerspot API.
Kolom: `id`, `command`, `device_sn`, `status` (pending/success/failed), `raw_payload`, `response`, `created_at`, `updated_at`
Buat index pada kolom `created_at DESC`.

### Tabel `webhook_logs`
Menyimpan setiap data webhook yang masuk dari mesin.
Kolom: `id`, `event_type`, `device_sn`, `status` (received/processed/failed), `raw_payload`, `created_at`
Buat index pada kolom `created_at DESC`.

### Tabel `command_logs`
Menyimpan riwayat command non-data seperti restart, set time, register online.
Kolom: `id`, `command`, `device_sn`, `status` (pending/success/failed), `notes`, `raw_payload`, `created_at`

### Tabel `settings`
Menyimpan konfigurasi API yang bisa diubah dari halaman Pengaturan. Data di tabel ini adalah sumber kebenaran untuk semua request ke Fingerspot — dibaca oleh `lib/fingerspot.ts` saat runtime.
Kolom: `id`, `key` (unique), `value`, `updated_at`
Seed data awal (insert 3 row): `cloud_id`, `api_key`, `webhook_secret`

Setiap kali user menyimpan form di halaman Pengaturan, lakukan **upsert** ke tabel ini berdasarkan kolom `key`.

### Supabase Function untuk Chart Dashboard
Buat SQL function bernama `attendance_daily_count` yang menerima parameter `start_date` dan `end_date`, lalu mengembalikan jumlah scan per hari dalam rentang tanggal tersebut. Digunakan untuk data grafik di halaman Dashboard.

---

## 🗂️ STEP 2 — Struktur Folder

Pastikan struktur folder project sudah sesuai sebelum mulai coding:

```
/                                          # Root project
│
├── app/                                   # Next.js App Router
│   │
│   ├── absensi/                           # Halaman Data Absensi
│   │   └── page.tsx
│   │
│   ├── api-logs/                          # Halaman Riwayat Request API
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx                   # Detail payload per request
│   │
│   ├── components/                        # Komponen UI (flat, tanpa subfolder)
│   │   ├── AttendanceChart.tsx            # Grafik kehadiran (line + bar + tooltip)
│   │   ├── AttendanceTable.tsx            # Tabel absensi + filter + modal detail
│   │   ├── MetricCard.tsx                 # Card statistik untuk dashboard
│   │   ├── Sidebar.tsx                    # Sidebar collapsible on hover
│   │   └── Topbar.tsx                     # Topbar dengan nama halaman aktif
│   │
│   ├── mesin/                             # API Routes — perintah ke mesin Fingerspot
│   │   ├── get-attlog/
│   │   │   └── route.ts                  # POST — ambil log absensi
│   │   ├── get-userinfo/
│   │   │   └── route.ts                  # POST — ambil data user
│   │   ├── set-userinfo/
│   │   │   └── route.ts                  # POST — tambah / edit user
│   │   ├── delete-userinfo/
│   │   │   └── route.ts                  # POST — hapus user
│   │   ├── get-all-pin/
│   │   │   └── route.ts                  # POST — ambil semua PIN
│   │   ├── set-time/
│   │   │   └── route.ts                  # POST — set waktu & timezone
│   │   ├── register-online/
│   │   │   └── route.ts                  # POST — registrasi verifikasi online
│   │   └── restart/
│   │       └── route.ts                  # POST — restart mesin
│   │
│   ├── pengaturan/                        # Halaman Pengaturan
│   │   └── page.tsx
│   │
│   ├── pin/                               # Halaman Data PIN
│   │   └── page.tsx
│   │
│   ├── user/                              # Halaman Data User
│   │   └── page.tsx
│   │
│   ├── favicon.ico
│   ├── globals.css                        # Class .glass, .glass-strong, background gradient
│   ├── layout.tsx                         # Master layout — Sidebar + Topbar
│   └── page.tsx                           # Halaman Dashboard
│
├── dokumentasi/                           # File .md dan referensi project
│
└── lib/                                   # Helper & utility (di root, bukan dalam app/)
    ├── fingerspot.ts                      # Helper: callFingerspot(url, body)
    ├── webhook.ts                         # Helper: validasi webhook secret (dipakai Edge Functions)
    ├── utils.ts                           # formatDate, cn(), formatVerifyType()
    └── supabase/
        ├── client.ts                      # Supabase browser client
        └── server.ts                      # Supabase server client
```

---

## 🔧 STEP 3 — Helper Files

### `lib/supabase/client.ts`
Buat Supabase browser client menggunakan `createBrowserClient` dari `@supabase/ssr`.
Gunakan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### `lib/supabase/server.ts`
Buat Supabase server client menggunakan `createServerClient` dari `@supabase/ssr`.
Integrasikan dengan `cookies()` dari `next/headers`.

### `lib/fingerspot.ts`
Buat fungsi `callFingerspot(url, body)` yang:
- Membaca `api_key` dan `cloud_id` dari tabel `settings` di Supabase (bukan dari env) — karena nilai ini bisa berubah dari halaman Pengaturan
- Melakukan POST ke URL Fingerspot yang diberikan secara langsung (tidak ada base URL — setiap endpoint memiliki URL penuh masing-masing)
- Menyertakan header `Authorization: Bearer <api_key dari DB>`
- Mengembalikan `{ success, data, message }`

### `lib/webhook.ts`
Buat fungsi `validateWebhookSecret(req)` yang:
- Membaca header `x-webhook-secret` atau `authorization`
- Membandingkan dengan `WEBHOOK_SECRET` dari env
- Mengembalikan `true` atau `false`

### `lib/utils.ts`
Buat fungsi utilitas:
- `formatDate(date)` — format tanggal ke string lokal Indonesia
- `cn(...classes)` — utility untuk merge Tailwind class (gunakan `clsx` atau `tailwind-merge`)
- `formatVerifyType(code)` — konversi kode verify type ke label teks (0=Finger, 1=Pin, 15=Face, dll)

---

## 📡 STEP 4 — API Routes (`app/mesin/`)

Setiap route menerima `POST` request dari frontend, memanggil Fingerspot API via `callFingerspot()`, dan mencatat hasilnya ke tabel `api_requests` atau `command_logs`.

**Pola umum setiap route:**
1. Terima body request dari frontend
2. Insert log awal ke `api_requests` dengan status `pending`
3. Panggil `callFingerspot()` dengan endpoint dan body yang sesuai
4. Update log status menjadi `success` atau `failed` beserta response-nya
5. Return response ke frontend

---

### 4.1 Get Attlog
**File:** `app/mesin/get-attlog/route.ts`
**Fungsi:** Mengambil data log absensi dari mesin untuk rentang tanggal tertentu.
Simpan hasil ke tabel `attlogs`. Log request ke `api_requests`.
**Letak trigger untuk send API:** ketika sudah memfilter tanggal maks 2 hari maka klik refresh untuk send API, nnti hasil otomatis masuk ke database dan tertampil di website.

**Config — isi sebelum implementasi:**
```
URL     : https://developer.fingerspot.io/api/get_attlog
Method  : POST
Body    : {"trans_id":"1", "cloud_id":"", "start_date":"", "end_date":""}
```

---

### 4.2 Get Userinfo
**File:** `app/mesin/get-userinfo/route.ts`
**Fungsi:** Mengambil seluruh data user/karyawan dari mesin.
Simpan hasil ke tabel `userinfos`. Log request ke `api_requests`.
**Letak trigger untuk send API:** tidak ada tombol trigger di website, jadi ketika sudah di Get All Pin maka API ini otomatis berjalan sejumlah Pin/ID yg di-get

**Config — isi sebelum implementasi:**
```
URL     : https://developer.fingerspot.io/api/get_userinfo  
Method  : POST
Body    : {"trans_id":"1", "cloud_id":"", "pin":""}

```

---

### 4.3 Set Userinfo
**File:** `app/mesin/set-userinfo/route.ts`
**Fungsi:** API ini sistemnya bekerja jika ID/pin sudah ada maka hanya bisa edit, jika pin belum ada bisa klik tombol tambah user .
Log ke `api_requests` dan `command_logs`.
**Letak trigger untuk send API:** Trigger pertama nanti di kolom action halaman Data User ada titik 3 nah itu ketika diklik munculkan tampilan pilihan edit atau delete atau tambah verifikasi, nah API ini bekerja jika mengedit user dan disimpan. Lalu trigger kedua ada di tombol tambah user, dan ketika disimpan API ini baru disend. 
**Note:** privilage 1=user biasa, 2=admin/manager, 3=subadmin/supervisor

**Config — isi sebelum implementasi:**
```
URL     : https://developer.fingerspot.io/api/set_userinfo
Method  : POST
Body    : {"trans_id":"1", "cloud_id":"", "data":{"pin":"", "name":"", "privilege":"1", "password":"111", "rfid": "", "template":""}}

```

---

### 4.4 Delete Userinfo
**File:** `app/mesin/delete-userinfo/route.ts`
**Fungsi:** Menghapus data user dari mesin berdasarkan PIN.
Log ke `command_logs`.
**Letak trigger untuk send API:** Melanjutkan yg set user tadi, kan ketika di kolom action halaman Data User ada titik 3 nah itu ketika diklik munculkan tampilan pilihan edit atau delete atau tambah verifikasi, nah API ini bekerja jika mengklik delete.

**Config — isi sebelum implementasi:**
```
URL     : https://developer.fingerspot.io/api/delete_userinfo
Method  : POST
Body    : {"trans_id":"1", "cloud_id":"", "pin":""}

```

---

### 4.5 Get All PIN
**File:** `app/mesin/get-all-pin/route.ts`
**Fungsi:** Mengambil seluruh daftar PIN/User ID yang terdaftar di mesin.
Simpan hasil ke tabel `pins`. Log ke `api_requests`.
**Letak trigger untuk send API:** Trigger untuk send API ini ada di halaman Data Pin dan mengklik tombol Ambil Semua Pin.
**Note:** sesuai dengan info di get user tadi, ketika API ini dijalankan jangan lupa langsung jalankan API get user

**Config — isi sebelum implementasi:**
```
URL     : https://developer.fingerspot.io/api/get_all_pin
Method  : POST
Body    : {"trans_id":"1", "cloud_id":""}

```

---

### 4.6 Set Time
**File:** `app/mesin/set-time/route.ts`
**Fungsi:** Mengubah waktu atau timezone pada mesin.
Log ke `command_logs`.
**Letak trigger untuk send API:** Trigger send API ini berada di halaman mesin pada tombol  set waktu & sinkronisasi. Untuk timezone yg nnti akan dikirimkan di body API gunakan value option nya ya.

**Config — isi sebelum implementasi:**
```
URL     : https://developer.fingerspot.io/api/set_time
Method  : POST
Body    : {"trans_id":"1", "cloud_id":"", "timezone":""}

```

---

### 4.7 Register Online
**File:** `app/mesin/register-online/route.ts`
**Fungsi:** Melakukan registrasi user ke mesin secara online.
Log ke `command_logs`.
**Letak trigger untuk send API:** Trigger send API ini berada di kolom action halaman Data User ada titik 3 nah itu ketika diklik munculkan tampilan pilihan edit atau delete atau tambah verifikasi, nah pilih yg tambah verifikasi.
**Note:** berikut parameter yg diisi pada bagian verification di body : 0-9: Jari, 12: Wajah, 13: vein

**Config — isi sebelum implementasi:**
```
URL     : https://developer.fingerspot.io/api/reg_online
Method  : POST
Body    : {"trans_id":"1", "cloud_id":"", "pin":"", "verification":""}

```

---

### 4.8 Restart Mesin
**File:** `app/mesin/restart/route.ts`
**Fungsi:** Merestart mesin dari jarak jauh.
Log ke `command_logs`.
**Letak trigger untuk send API:** Trigger send API ini berada di halaman mesin pada tombol Restart Mesin Sekarang

**Config — isi sebelum implementasi:**
```
URL     : https://developer.fingerspot.io/api/restart_device
Method  : POST
Body    : {"trans_id":"1", "cloud_id":""}

```

---

## ✅ Checklist Backend

### Database
- [x] Buat tabel `attlogs`
- [x] Buat tabel `userinfos`
- [x] Buat tabel `pins`
- [x] Buat tabel `api_requests`
- [x] Buat tabel `webhook_logs`
- [x] Buat tabel `command_logs`
- [x] Buat tabel `settings` + seed 3 row (`cloud_id`, `api_key`, `webhook_secret`) dengan value kosong
- [x] Pastikan halaman Pengaturan melakukan upsert ke tabel `settings` saat form disimpan
- [x] Pastikan `lib/fingerspot.ts` membaca `api_key` dan `cloud_id` dari tabel `settings`
- [x] Buat Supabase function `attendance_daily_count`

### Helper Files
- [x] `lib/supabase/client.ts`
- [x] `lib/supabase/server.ts`
- [x] `lib/fingerspot.ts`
- [x] `lib/webhook.ts`
- [x] `lib/utils.ts`

### API Routes (`mesin/`)
- [x] `get-attlog`
- [x] `get-userinfo`
- [x] `set-userinfo`
- [x] `delete-userinfo`
- [x] `get-all-pin`
- [x] `set-time`
- [x] `register-online`
- [x] `restart`

## 📎 Referensi

- Fingerspot API Docs: https://developer.fingerspot.io/customer/api
- Supabase Docs: https://supabase.com/docs
- Next.js App Router: https://nextjs.org/docs/app

### Note
    1. Setiap body API yg membutuhkan Cloud ID, buat agar mengambil dari database tabel settings
    2. Pada Halaman Mesin kan ada 2 dropdown yg meminta pilihan mesin, nah itu buat agar mengambil dari database tabel settings yaitu Cloud ID nya saja
    3. Maks range hari ketika get attlog yaitu 2 hari jadi setting agar hanya bisa filter 2 hari
    4. Untuk hasil get user info langsung tampilkan di data user
    5. Setiap progres yg telah kamu lakukan edit .md ini di bagian checklist backend