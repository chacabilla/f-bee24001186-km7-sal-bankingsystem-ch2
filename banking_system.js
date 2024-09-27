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
                            rl.close(); // menutup input readline setelah transaksi selesai
                        })
                        .catch((error) => {
                            console.error(error);
                            rl.close(); // Menutup input readline jika ada error
                        });
                }, 2000);
            });
            
        } else if (pilihan === '2') {
            rl.question('\nMasukkan jumlah withdraw: ', (withdrawAmount) => {
                const amount = parseFloat(withdrawAmount);
                console.log("Memproses withdraw...");

                setTimeout(() => {
                    rekening.withdraw(amount)
                        .then((message) => {
                            console.log(message); // output sukses
                            rl.close(); // menutup input readline setelah transaksi selesai
                        })
                        .catch((error) => {
                            console.error(error);
                            rl.close(); // menutup input readline jika ada error
                        });
                }, 2000);
                });

        } else {
            console.log("Pilihan tidak valid.");
            rl.close(); 
        }
    });
}

console.log("Selamat datang di Bank. Saldo awal: " + rekening.getSaldo());
menu();
