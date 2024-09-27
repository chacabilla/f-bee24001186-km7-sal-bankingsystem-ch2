const BankAccount = require('./bank_account.js');

const rekening = new BankAccount(1000); // saldo awal

function tampilkanTransaksi() {
    console.log("Selamat datang di Bank. Saldo awal: " + rekening.getSaldo());

    console.log(rekening.deposit(100));
    console.log(rekening.withdraw(500));
    console.log("Saldo akhir: " + rekening.getSaldo());
}

tampilkanTransaksi();
