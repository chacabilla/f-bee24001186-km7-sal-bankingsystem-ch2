const TransactionService = require('../transactions');
const { PrismaClient } = require('@prisma/client');

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

  // test createTransaction success case
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

  // test createTransaction failed case (source account does not exist)
  test('createTransaction should throw error if source account does not exist', async () => {
    const data = { sourceAccountId: 1, destinationAccountId: 2, amount: 500 };

    prisma.bankAccount.findUnique.mockResolvedValueOnce(null);
    await expect(TransactionService.createTransaction(data)).rejects.toThrow('Source or Destination Account does not exist');
  });

  // test createTransaction failed case (destination account does not exist)
  test('createTransaction should throw error if destination account does not exist', async () => {
    const data = { sourceAccountId: 1, destinationAccountId: 2, amount: 500 };

    prisma.bankAccount.findUnique
      .mockResolvedValueOnce({ id: 1, balance: 1000 })
      .mockResolvedValueOnce(null);
    await expect(TransactionService.createTransaction(data)).rejects.toThrow('Source or Destination Account does not exist');
  });

  // test createTransaction failed case (transaction creation fails)
  test('createTransaction should throw error if transaction creation fails', async () => {
    const data = { sourceAccountId: 1, destinationAccountId: 2, amount: 500 };

    prisma.bankAccount.findUnique
      .mockResolvedValueOnce({ id: 1, balance: 1000 })
      .mockResolvedValueOnce({ id: 2, balance: 2000 });
    prisma.transaction.create.mockRejectedValue(new Error('Transaction creation failed'));

    await expect(TransactionService.createTransaction(data)).rejects.toThrow('Transaction creation failed');
  });

  // test getAllTransactions success case
  test('getAllTransactions should return a list of transactions', async () => {
    const mockTransactions = [{ id: 1, amount: 500 }];
    prisma.transaction.findMany.mockResolvedValue(mockTransactions);

    const result = await TransactionService.getAllTransactions();
    expect(result).toEqual(mockTransactions);
  });

  // test getTransactionById success case
  test('getTransactionById should return a transaction by ID', async () => {
    const mockTransaction = { id: 1, sourceAccountId: 1, destinationAccountId: 2, amount: 500 };
    prisma.transaction.findUnique.mockResolvedValue(mockTransaction);

    const result = await TransactionService.getTransactionById(1);
    expect(result).toEqual(mockTransaction);
  });
});
