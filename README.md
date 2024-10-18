# Bank System API

## Deskripsi
Proyek ini adalah sebuah API untuk sistem perbankan yang dibangun dengan menggunakan Express.js, Prisma, dan PostgreSQL. API ini memungkinkan pengguna untuk melakukan operasi seperti pembuatan pengguna, akun bank, dan transaksi antara akun bank.

## Prerequisites
Sebelum menjalankan proyek ini, pastikan Anda memiliki teknologi berikut terinstal:
- Node.js (versi 14.x atau lebih baru)
- PostgreSQL (versi 12.x atau lebih baru)
- Prisma CLI (pastikan untuk menginstal saat menginstal dependensi)

## Cara Memakai
1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/username/repo-name.git
   cd repo-name
   ```

2. **Instal dependensi:**
   ```bash
   npm install express prisma @prisma/client joi ejs
   ```

3. **Buat file `.env` dari file sample:**
   Salin file `.env.sample` menjadi `.env` dan sesuaikan `DATABASE_URL` dengan pengaturan database Anda.
   ```bash
   cp .env.sample .env
   ```

## Cara Menjalankan
1. **Migrasi database:**
   Jalankan migrasi untuk membuat struktur tabel di database Anda.
   ```bash
   npx prisma migrate dev --name init
   ```

2. **Jalankan aplikasi:**
   ```node 
   index.js
   ```

Aplikasi akan berjalan di `http://localhost:3000`.