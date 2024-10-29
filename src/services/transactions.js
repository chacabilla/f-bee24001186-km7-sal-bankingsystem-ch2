const Joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const transactionSchema = Joi.object({
    sourceAccountId: Joi.number().integer().required(),
    destinationAccountId: Joi.number().integer().required(),
    amount: Joi.number().positive().required()
});

class TransactionService {
    async createTransaction(data) {
        // validasi dengan Joi
        const { error } = transactionSchema.validate(data);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const { sourceAccountId, destinationAccountId, amount } = data;

        try {
            const sourceAccount = await this.getAccountById(sourceAccountId);
            const destinationAccount = await this.getAccountById(destinationAccountId);

            if (!sourceAccount || !destinationAccount) {
                throw new Error('Source or Destination Account does not exist');
            }

            const transaction = await prisma.transaction.create({
                data: {
                    sourceAccountId,
                    destinationAccountId,
                    amount
                }
            });
            return transaction;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllTransactions() {
        const transactions = await prisma.transaction.findMany();
        return transactions;
    }

    async getTransactionById(transactionId) {
        const transaction = await prisma.transaction.findUnique({
            where: { id: Number(transactionId) },
            include: {
                sourceAccount: true,
                destinationAccount: true
            }
        });
        return transaction;
    }

    async getAccountById(accountId) {
        return await prisma.bankAccount.findUnique({
            where: { id: accountId },
        });
    }
}

module.exports = new TransactionService();
