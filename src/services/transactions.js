import Joi from 'joi';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Schema validasi transaksi
const transactionSchema = Joi.object({
    sourceAccountId: Joi.number().integer().required(),
    destinationAccountId: Joi.number().integer().required(),
    amount: Joi.number().positive().required(),
});

class TransactionService {
    async createTransaction(data) {
        const { error } = transactionSchema.validate(data);
        if (error) {
            throw new Error(`Validation Error: ${error.details[0].message}`);
        }

        const { sourceAccountId, destinationAccountId, amount } = data;

        const sourceAccount = await this.getAccountById(sourceAccountId);
        const destinationAccount = await this.getAccountById(destinationAccountId);

        if (!sourceAccount || !destinationAccount) {
            throw new Error('Source or Destination account does not exist');
        }

        if (sourceAccount.balance < amount) {
            throw new Error('Insufficient balance in the source account');
        }

        try {
            const [updatedSourceAccount, updatedDestinationAccount, transaction] = await prisma.$transaction([
                prisma.bankAccount.update({
                    where: { id: sourceAccountId },
                    data: { balance: sourceAccount.balance - amount },
                }),
                prisma.bankAccount.update({
                    where: { id: destinationAccountId },
                    data: { balance: destinationAccount.balance + amount },
                }),
                prisma.transaction.create({
                    data: { sourceAccountId, destinationAccountId, amount },
                }),
            ]);

            return { transaction, updatedSourceAccount, updatedDestinationAccount };
        } catch (err) {
            throw new Error(`Transaction Error: ${err.message}`);
        }
    }

    async getAllTransactions() {
        return await prisma.transaction.findMany();
    }

    async getTransactionById(transactionId) {
        const transaction = await prisma.transaction.findUnique({
            where: { id: Number(transactionId) },
            include: {
                sourceAccount: true,
                destinationAccount: true,
            },
        });

        if (!transaction) {
            throw new Error('Transaction not found');
        }

        return transaction;
    }

    async getAccountById(accountId) {
        return await prisma.bankAccount.findUnique({
            where: { id: accountId },
        });
    }
}

export default new TransactionService();
