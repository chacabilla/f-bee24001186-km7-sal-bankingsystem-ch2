import Joi from 'joi';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const accountSchema = Joi.object({
    userId: Joi.number().integer().required(),
    bankName: Joi.string().required(),
    bankAccountNumber: Joi.string().required(),
    balance: Joi.number().positive().required()
});

class AccountService {
    async createAccount(data) {
        const { error } = accountSchema.validate(data);
        if (error) {
            throw new Error(`Validation error: ${error.details[0].message}`);
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
            console.error('Error in createAccount:', error.message);
            throw new Error('Failed to create account');
        }
    }

    // Mengambil semua akun
    async getAllAccounts() {
        try {
            const accounts = await prisma.bankAccount.findMany();
            return accounts;
        } catch (error) {
            console.error('Error in getAllAccounts:', error.message);
            throw new Error('Failed to fetch accounts');
        }
    }

    // Mengambil akun berdasarkan ID
    async getAccountById(accountId) {
        try {
            const account = await prisma.bankAccount.findUnique({
                where: { id: Number(accountId) }
            });
            if (!account) throw new Error('Account not found');
            return account;
        } catch (error) {
            console.error('Error in getAccountById:', error.message);
            throw new Error('Failed to fetch account');
        }
    }

    // Menarik dana dari akun
    async withdraw(accountId, amount) {
        try {
            const account = await prisma.bankAccount.findUnique({ where: { id: Number(accountId) } });
            if (!account) throw new Error('Account not found');
            if (account.balance < amount) {
                throw new Error('Insufficient balance');
            }

            // Gunakan transaksi untuk konsistensi data
            const updatedAccount = await prisma.$transaction(async (tx) => {
                return await tx.bankAccount.update({
                    where: { id: Number(accountId) },
                    data: { balance: { decrement: amount } }
                });
            });

            return updatedAccount;
        } catch (error) {
            console.error('Error in withdraw:', error.message);
            throw new Error('Failed to withdraw funds');
        }
    }

    // Menyetor dana ke akun
    async deposit(accountId, amount) {
        try {
            const account = await prisma.bankAccount.findUnique({ where: { id: Number(accountId) } });
            if (!account) throw new Error('Account not found');

            // Gunakan transaksi untuk konsistensi data
            const updatedAccount = await prisma.$transaction(async (tx) => {
                return await tx.bankAccount.update({
                    where: { id: Number(accountId) },
                    data: { balance: { increment: amount } }
                });
            });

            return updatedAccount;
        } catch (error) {
            console.error('Error in deposit:', error.message);
            throw new Error('Failed to deposit funds');
        }
    }

    // Menghapus akun berdasarkan ID
    async deleteAccount(accountId) {
        try {
            const account = await prisma.bankAccount.findUnique({ where: { id: Number(accountId) } });
            if (!account) throw new Error('Account not found');

            const deletedAccount = await prisma.bankAccount.delete({
                where: { id: Number(accountId) }
            });
            return deletedAccount;
        } catch (error) {
            console.error('Error in deleteAccount:', error.message);
            throw new Error('Failed to delete account');
        }
    }
}

export default new AccountService();
