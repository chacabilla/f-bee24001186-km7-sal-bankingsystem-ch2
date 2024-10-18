const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TransactionService {
    async createTransaction(data) {
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
