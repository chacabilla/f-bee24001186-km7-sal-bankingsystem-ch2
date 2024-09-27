const BankAccount = require('./bank_account'); // Mengimpor class BankAccount dari bank_account.js

const rekening = new BankAccount(1000); // saldo awal

async function jalankanTransaksi() {
    console.log("Saldo awal: " + rekening.getSaldo());

    try {
        const depositMessage = await rekening.deposit(500);
        console.log(depositMessage); //output deposit

        const withdrawMessage = await rekening.withdraw(300);
        console.log(withdrawMessage); // output withdraw
        console.log("\nTransaksi selesai. Saldo akhir: " + rekening.getSaldo());
    } catch (error) {
        console.error(error);
    }
}

jalankanTransaksi();
