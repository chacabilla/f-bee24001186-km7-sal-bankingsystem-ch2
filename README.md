## Struktur Proyek

- `bank_account.js`: Berisi definisi kelas `BankAccount` dengan metode untuk melakukan deposit, withdraw, dan mendapatkan saldo.
- `banking_system.js`: Berisi logika antarmuka pengguna yang memungkinkan interaksi dengan pengguna melalui terminal.

## Flowchart

![Flowchart Banking System](/assets/flowchart-ch2.jpg "Flowchart Banking System")

## Cara Kerja Program

1. **Inisialisasi**:
   - Program dimulai dengan membuat instance `BankAccount` dengan saldo awal yang ditetapkan (misalnya, 1000).

2. **Menu Transaksi**:
   - Pengguna akan diberikan info saldo awal dan diberikan pilihan untuk melakukan deposit atau penarikan.
   - Pilihan ditampilkan di terminal sebagai:
     ```
     1. Deposit
     2. Withdraw
     ```
   - Pengguna diminta untuk memasukkan angka (1/2) sesuai pilihan mereka.

3. **Deposit**:
   - Jika pengguna memilih untuk melakukan deposit, mereka akan diminta untuk memasukkan jumlah deposit.
   - Setelah jumlah dimasukkan, proses deposit dilakukan, dan hasilnya ditampilkan setelah penundaan 2 detik.

4. **Withdraw**:
   - Jika pengguna memilih untuk melakukan penarikan, mereka akan diminta untuk memasukkan jumlah penarikan.
   - Setelah jumlah dimasukkan, proses penarikan dilakukan, dan hasilnya ditampilkan setelah penundaan 2 detik.
   - Program akan memverifikasi apakah saldo mencukupi untuk penarikan yang diminta.

5. **Melanjutkan Transaksi**:
   - Setelah setiap transaksi, pengguna akan ditanya apakah ingin melanjutkan transaksi.
   - Jika pengguna memilih 'y', menu transaksi akan ditampilkan kembali. Jika 'n', program akan menutup.

## Cara Menjalankan Program

1. Clone repositori ini atau unduh file `bank_account.js` dan `banking_system.js`.
2. Buka terminal dan arahkan ke direktori tempat file tersebut berada.
3. Jalankan perintah berikut:
   ```bash
   node banking_system.js