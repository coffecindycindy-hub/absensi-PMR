# PMR Attendance — SMK Muhammadiyah 1 Penajam Paser Utara

Sistem Manajemen dan Absensi Ekstrakurikuler Palang Merah Remaja (PMR) SMK Muhammadiyah 1 Penajam Paser Utara (PPU). Aplikasi web ini dirancang secara modern, mobile-first, dan responsive untuk mendigitalisasi proses absensi, mengelola data anggota kesiswaan, memantau riwayat kegiatan, dan menyajikan laporan kehadiran terperinci secara real-time.

---

## 1. Daftar Fitur (Feature List)

Aplikasi memiliki 3 role utama dengan hak akses kognitif terperinci:

### 1.1 Administrasi (Admin)
- **Dashboard Ringkasan:** Statistik anggota aktif, rincian kehadiran kesiswaan hari ini (Hadir, Izin, Sakit, Alpa), serta panel daftar kegiatan dan checking absensi masuk terbaru.
- **Manajemen Anggota:** Operasi penuh (CRUD) data kesiswaan anggota PMR termasuk NIS, Jabatan, Kelas, Jenis Kelamin, Nomor HP, Email, dan kata sandi login. Dilengkapi status keanggotaan (Aktif/Nonaktif).
- **Manajemen Kegiatan:** Pembuatan, pengubahan, dan pembatalan materi latihan rutin maupun agenda PMR lengkap dengan integrasi tanggal dan batas waktu.
- **Koreksi Absensi:** Antarmuka korektif lembar kehadiran kesiswaan, memungkinkan admin merubah status kehadiran anggota (Hadir, Izin, Sakit, Alpa) dan menambahkan alasan administratif.
- **Laporan Statistik:** Rekapitulasi persentase rata-rata rasio kehadiran per-anggota dan kolektif kesiswaan dengan filter rentang tanggal.

### 1.2 Pembina (Supervisor)
- **Dashboard Monitoring:** Pemantauan jumlah anggota aktif, total akumulasi rasio keikutsertaan kesiswaan, dan list kegiatan kesiswaan.
- **Daftar Anggota (Read-Only):** Melihat seluruh data anggota aktif dan jabatan kesiswaan kualitatif.
- **Kegiatan & Absensi (Read-Only):** Memantau agenda kegiatan dan melihat lembar absensi masuk serta catatan ketidakhadiran anggota tanpa hak akses perubahan.
- **Laporan Analitis (Read-Only):** Mengamati data laporan performa rasio kehadiran anggota kesiswaan PMR.

### 1.3 Anggota (Member)
- **Dashboard Anggota:** Menyapa sapaan interaktif berdasarkan waktu, status keikutsertaan agenda hari ini, persentase rasio kehadiran personal, dan panel pelaporan absensi cepat.
- **Pelaporan Absensi Mandiri:** Melaporkan status kehadiran secara instan (Hadir, Izin, Sakit) beserta catatan pendukung untuk kegiatan yang sedang dijadwalkan hari ini.
- **Riwayat Absensi:** Melihat catatan kehadiran personal dari masa ke masa dengan filter status dan rentang tanggal untuk mencegah IDOR.
- **Kelola Profil:** Memperbarui data diri serta merubah kata sandi login personal secara mandiri.

---

## 2. Stack Teknologi (Tech Stack)

Aplikasi dibangun menggunakan teknologi modern terbaik untuk memastikan performa maksimal dan maintainability tinggi:
- **Framework:** Next.js 15+ (App Router)
- **Bahasa Pemrograman:** TypeScript
- **Styling & Desain:** Tailwind CSS dengan nuansa visual identitas PMR (Merah, Putih, Abu-abu, Slate)
- **Library Animasi:** Motion (`motion/react`)
- **Penanganan Sesi & Autentikasi:** Custom JWT & cookie-based session signed with Node.js HMAC-SHA256
- **Database Layer:** Pure-JS Transactional Local JSON Database with atomic write lock (`lib/db/db.ts`)
- **Icon Library:** Lucide React

---

## 3. Persyaratan Sistem (Requirements)

Sebelum menjalankan aplikasi, pastikan sistem Anda memiliki:
- **Node.js:** Versi 18.x atau yang lebih baru (disarankan LTS)
- **NPM / Bun / Yarn:** Pengelola paket standar Node.js

---

## 4. Instalasi & Konfigurasi (Installation & Setup)

Lakukan langkah berikut untuk menginstal dan menjalankan aplikasi secara lokal:

### 4.1 Kloning & Instalasi Paket
```bash
# Instal seluruh dependensi package.json
npm install
```

### 4.2 Konfigurasi Environment Variables (`.env`)
Salin file `.env.example` menjadi `.env` pada root direktori:
```bash
cp .env.example .env
```
Isi konfigurasi kunci di `.env`:
- `AUTH_SECRET`: Kunci rahasia untuk enkripsi tanda tangan digital sesi login (Contoh: `pmr-attendance-super-secret-key-12345`).
- `GEMINI_API_KEY`: Kunci rahasia API Gemini (jika diperlukan untuk ekstensi AI di masa depan).

---

## 5. Database Setup, Migrasi & Seed

Aplikasi ini menggunakan database berbasis transaksi JSON (`data/database.json`) yang andal, aman, dan 100% bebas dari risiko kegagalan engine C++ biner di server/sandboxing kesiswaan.

- **Setup & Migrasi:** Database akan terkonfigurasi secara otomatis pada saat aplikasi pertama kali dijalankan. Direktori `/data` dan file `database.json` akan dibuat jika belum tersedia.
- **Auto-Seeding:** Pada saat pertama kali dibuat, database akan otomatis terisi dengan data awal (seed data) yang representatif untuk pengujian kualitatif (Admin, Pembina, 3 Profil Anggota, Kegiatan Selesai, dan Sesi Absensi Masuk).

---

## 6. Pengembangan & Menjalankan Aplikasi (Development & Build)

### 6.1 Mode Pengembangan (Development Mode)
Jalankan dev server dengan perintah berikut:
```bash
npm run dev
```
Aplikasi akan tersedia pada port `3000` (biasanya `http://localhost:3000`).

### 6.2 Membangun Aplikasi (Build Production)
Untuk melakukan kompilasi aplikasi ke mode siap produksi:
```bash
npm run build
```

### 6.3 Menjalankan Aplikasi Hasil Build (Production Execution)
```bash
npm run start
```

---

---

## 7. Struktur Folder Ringkas (Folder Structure)

```text
/
├── app/                  # Direktori Utama Next.js App Router
│   ├── admin/            # Halaman Dashboard, Anggota, Kegiatan & Laporan Admin
│   ├── supervisor/       # Halaman Dashboard, Anggota, Absensi & Laporan Pembina
│   ├── member/           # Halaman Dashboard, Agenda, Riwayat Absen Anggota
│   ├── login/            # Halaman Gerbang Masuk Sistem
│   ├── globals.css       # Styling Global Tailwind CSS
│   ├── layout.tsx        # Base Layout & Metadata HTML Entry Point
│   └── page.tsx          # Router Beranda (Redirect Sesuai Sesi Peran)
├── components/           # Komponen UI/UX Reusable & Interaktif
│   ├── layout/           # Shell Layout Sidebar & Header Sesuai Peran
│   ├── attendance/       # Modul Absen Mandiri, Lembar Koreksi & Riwayat
│   ├── members/          # Formulir & List Anggota
│   ├── activities/       # Formulir & Grid Kegiatan
│   ├── reports/          # Filter Laporan Rentang Tanggal
│   └── profile/          # Formulir Pengaturan Akun Login
├── data/                 # Lokasi File Penyimpanan Persisten (database.json)
├── lib/                  # Helper & Infrastruktur Server-Side
│   ├── db/               # Inisialisasi Database JSON & Logika Operasi CRUD
│   ├── auth/             # Manajemen Sesi Enkripsi JWT Cookie & Aksi Login
│   ├── services/         # Service Layer untuk Bisnis Logis CRUD & Laporan
│   └── utils.ts          # Integrasi Utility Tailwind Class Name
├── metadata.json         # Konfigurasi Kemampuan Aplikasi AI Studio
├── package.json          # Manajemen Dependensi & Perintah Script NPM
└── tsconfig.json         # Konfigurasi TypeScript Proyek
```
