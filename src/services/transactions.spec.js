// src/services/transactions.spec.js
const TransactionService = require('./transactions');
const { PrismaClient } = require('@prisma/client');

// Mock prisma client
jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    transaction: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    bankAccount: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('TransactionService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createTransaction should validate data and create a transaction', async () => {
    const mockTransaction = { id: 1, sourceAccountId: 1, destinationAccountId: 2, amount: 500 };
    prisma.bankAccount.findUnique
      .mockResolvedValueOnce({ id: 1, balance: 1000 })
      .mockResolvedValueOnce({ id: 2, balance: 2000 });
    prisma.transaction.create.mockResolvedValue(mockTransaction);

    const data = { sourceAccountId: 1, destinationAccountId: 2, amount: 500 };
    const result = await TransactionService.createTransaction(data);

    expect(result).toEqual(mockTransaction);
    expect(prisma.transaction.create).toHaveBeenCalledWith({ data });
  });

  test('getAllTransactions should return a list of transactions', async () => {
    const mockTransactions = [{ id: 1, amount: 500 }];
    prisma.transaction.findMany.mockResolvedValue(mockTransactions);

    const result = await TransactionService.getAllTransactions();
    expect(result).toEqual(mockTransactions);
  });

  test('getTransactionById should return a transaction by ID', async () => {
    const mockTransaction = { id: 1, sourceAccountId: 1, destinationAccountId: 2, amount: 500 };
    prisma.transaction.findUnique.mockResolvedValue(mockTransaction);

    const result = await TransactionService.getTransactionById(1);
    expect(result).toEqual(mockTransaction);
  });
});
