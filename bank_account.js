class BankAccount {
    constructor(SaldoAwal) {
        this.saldo = SaldoAwal;
    }

    deposit(amount) {
        if (amount > 0) {
            this.saldo += amount;
            return `Deposit berhasil sebesar ${amount}. Saldo saat ini: ${this.saldo}`;
        } else {
            return "Jumlah deposit harus lebih besar dari 0.";
        }
    }

    withdraw(amount) {
        if (amount > 0 && amount <= this.saldo) {
            this.saldo -= amount;
            return `Withdraw berhasil sebesar ${amount}. Saldo saat ini: ${this.saldo}`;
        } else if (amount > this.saldo) {
            return "Saldo tidak mencukupi untuk penarikan.";
        } else {
            return "Jumlah withdraw harus lebih besar dari 0.";
        }
    }

    getSaldo() {
        return this.saldo;
    }
}

const rekening = new BankAccount(1000); // saldo awal

console.log(rekening.deposit(100));
console.log(rekening.withdraw(500));
console.log(`Saldo akhir: ${rekening.getSaldo()}`);