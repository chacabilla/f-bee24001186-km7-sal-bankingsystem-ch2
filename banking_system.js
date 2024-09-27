const readline = require('readline');
const BankAccount = require('./bank_account');

const rekening = new BankAccount(1000); // saldo awal

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Menu transaksi
function menu() {
    console.log("\n1. Deposit");
    console.log("2. Withdraw");
    rl.question('Silahkan pilih angka (1/2): ', (pilihan) => {
        if (pilihan === '1') {
            rl.question('\nMasukkan jumlah deposit: ', (depositAmount) => {
                const amount = parseFloat(depositAmount);
                console.log("Memproses deposit...");
                
                setTimeout(() => {
                    rekening.deposit(amount)
                        .then((message) => {
                            console.log(message); // output sukses
                            lanjutTransaksi();
                        })
                        .catch((error) => {
                            console.error(error);
                            lanjutTransaksi();
                        });
                }, 2000); // delay deposit 2 detik
            });
        } else if (pilihan === '2') {
            rl.question('\nMasukkan jumlah withdraw: ', (withdrawAmount) => {
                const amount = parseFloat(withdrawAmount);
                console.log("Memproses withdraw...");
              
                setTimeout(() => {
                    rekening.withdraw(amount)
                        .then((message) => {
                            console.log(message); // output sukses
                            lanjutTransaksi();
                        })
                        .catch((error) => {
                            console.error(error);
                            lanjutTransaksi();
                        });
                }, 2000); // delay withdraw 2 detik
            });
        } else {
            console.log("Pilihan tidak valid.");
            menu(); // kembali ke menu jika input salah
        }
    });
}

// lanjutkan transaksi
function lanjutTransaksi() {
    rl.question('\nApakah ingin melanjutkan transaksi? (y/n): ', (jawaban) => {
        if (jawaban.toLowerCase() === 'y') {
            menu(); // back to menu untuk transaksi berikutnya
        } else {
            console.log("Transaksi selesai. Terima kasih!");
            rl.close(); // menutup input readline
        }
    });
}

console.log("Selamat datang di Bank. Saldo awal: " + rekening.getSaldo());
menu();