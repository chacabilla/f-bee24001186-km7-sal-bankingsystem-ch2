const Joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const accountSchema = Joi.object({
    userId: Joi.number().integer().required(),
    bankName: Joi.string().required(),
    bankAccountNumber: Joi.string().required(),
    balance: Joi.number().positive().required()
});

class AccountService {
    async createAccount(data) {
        // validasi dengan Joi
        const { error } = accountSchema.validate(data);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const { userId, bankName, bankAccountNumber, balance } = data;
        const existingAccount = await prisma.bankAccount.findUnique({
            where: { bankAccountNumber }
        });

        if (existingAccount) {
            throw new Error('Account with this bank account number already exists');
        }

        try {
            const account = await prisma.bankAccount.create({
                data: {
                    userId,
                    bankName,
                    bankAccountNumber,
                    balance
                }
            });
            return account;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllAccounts() {
        const accounts = await prisma.bankAccount.findMany();
        return accounts;
    }

    async getAccountById(accountId) {
        const account = await prisma.bankAccount.findUnique({
            where: { id: Number(accountId) }
        });
        return account;
    }

    async withdraw(accountId, amount) {
        const account = await prisma.bankAccount.findUnique({ where: { id: Number(accountId) } });
        if (!account) throw new Error('Account not found');
        if (account.balance < amount) {
            throw new Error('Insufficient balance');
        }

        const updatedAccount = await prisma.bankAccount.update({
            where: { id: Number(accountId) },
            data: { balance: { decrement: amount } }
        });
        return updatedAccount;
    }

    async deposit(accountId, amount) {
        const account = await prisma.bankAccount.findUnique({ where: { id: Number(accountId) } });
        if (!account) throw new Error('Account not found');

        const updatedAccount = await prisma.bankAccount.update({
            where: { id: Number(accountId) },
            data: { balance: { increment: amount } }
        });
        return updatedAccount;
    }

    async deleteAccount(accountId) {
        const account = await prisma.bankAccount.findUnique({ where: { id: Number(accountId) } });
        if (!account) throw new Error('Account not found');
        try {
            const deletedAccount = await prisma.bankAccount.delete({
                where: { id: Number(accountId) }
            });
            return deletedAccount;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new AccountService();
