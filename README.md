# Banking System Challenge Chapter 5

## Deskripsi
Project ini adalah API backend untuk mengelola data pengguna, akun bank, dan transaksi keuangan. API ini memungkinkan operasi CRUD pada akun pengguna, mencakup fitur deposit, withdraw, dan manajemen profil. Project ini dibangun menggunakan Express.js dan Prisma, serta menerapkan validasi menggunakan Joi.

## Fitur
- Manajemen Pengguna: CRUD pada data pengguna.
- Manajemen Akun Bank: Membuat, mengubah, menghapus, serta mengelola saldo akun.
- Transaksi: Deposit dan withdraw pada akun.
- Dokumentasi API menggunakan Swagger.
- Unit Testing menggunakan jest.

## Persyaratan
- Node.js (minimal versi 14)
- PostgreSQL (untuk penyimpanan data)
- Prisma (ORM untuk integrasi database)
- Joi (untuk validasi data)

## Instalasi
1. Clone repository ini:
   ```bash
   git clone https://github.com/username/projectname.git
   cd projectname
   ```

2. Instal dependencies:
   ```bash
   npm install
   ```

3. Konfigurasikan database:
   - Salin `.env.example` menjadi `.env` dan atur variabel sesuai dengan konfigurasi PostgreSQL Anda.
   - Contoh konfigurasi:
     ```
     DATABASE_URL="postgresql://user:password@localhost:5432/database_name"
     ```

4. Lakukan migrasi database menggunakan Prisma:
   ```bash
   npx prisma migrate dev --name init
   ```

## Menjalankan Aplikasi
Jalankan server:
```bash
node index.js
```
Server akan berjalan di `http://localhost:3000`.

## Struktur Project
- `models/`: Berisi definisi model dengan Prisma.
- `routes/`: Berisi definisi rute untuk setiap endpoint.
- `services/`: Berisi logika bisnis dan integrasi database.
- `middleware/`: Berisi middleware untuk autentikasi dan validasi.

## Dokumentasi API
Swagger digunakan untuk dokumentasi API. Setelah server berjalan, dokumentasi dapat diakses di:
```
http://localhost:3000/api-docs
```

## Testing
Project ini menggunakan Jest untuk testing. Untuk menjalankan tes, gunakan:
```bash
npm test
```