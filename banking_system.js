const BankAccount = require('./bank_account');

const rekening = new BankAccount(1000); // saldo awal

function jalankanTransaksi() {
    console.log("Saldo awal: " + rekening.getSaldo());

    console.log("\nMemproses deposit sebesar 500...");
    setTimeout(() => {
        rekening.deposit(500)
            .then((message) => {
                console.log(message); // output sukses deposit

                console.log("\nMemproses withdraw sebesar 300...");
                setTimeout(() => {
                    rekening.withdraw(300)
                        .then((message) => {
                            console.log(message); // output sukses withdraw
                            console.log("\nTransaksi selesai. Saldo akhir: " + rekening.getSaldo());
                        })
                        .catch((error) => console.error(error));
                }, 2000); // delay sebelum withdraw
            })
            .catch((error) => console.error(error));
    }, 2000); // delay sebelum deposit
}

jalankanTransaksi();
