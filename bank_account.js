class BankAccount {
    constructor(SaldoAwal) {
        this.saldo = SaldoAwal;
    }

    deposit(amount) {
        return new Promise((resolve, reject) => {
            if (amount > 0) {
                this.saldo += amount;
                resolve(`Deposit berhasil sebesar ${amount}. Saldo saat ini: ${this.saldo}`);
            } else {
                reject("Jumlah deposit harus lebih besar dari 0.");
            }
        });
    }

    withdraw(amount) {
        return new Promise((resolve, reject) => {
            if (amount > 0 && amount <= this.saldo) {
                this.saldo -= amount;
                resolve(`Withdraw berhasil sebesar ${amount}. Saldo saat ini: ${this.saldo}`);
            } else if (amount > this.saldo) {
                reject("Saldo tidak mencukupi untuk penarikan.");
            } else {
                reject("Jumlah withdraw harus lebih besar dari 0.");
            }
        });
    }

    getSaldo() {
        return this.saldo;
    }
}

module.exports = BankAccount;