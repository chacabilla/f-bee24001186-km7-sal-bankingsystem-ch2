const AccountService = require('../accounts'); // Ensure correct import path
const { PrismaClient } = require('@prisma/client');

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        bankAccount: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('AccountService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test createAccount success case
    test('createAccount should validate data and create an account', async () => {
        const mockAccount = { id: 1, userId: 1, bankName: 'Test Bank', bankAccountNumber: '123456', balance: 1000 };
        prisma.bankAccount.create.mockResolvedValue(mockAccount);

        const data = { userId: 1, bankName: 'Test Bank', bankAccountNumber: '123456', balance: 1000 };
        const result = await AccountService.createAccount(data);

        expect(prisma.bankAccount.create).toHaveBeenCalledWith({
            data: {
                userId: data.userId,
                bankName: data.bankName,
                bankAccountNumber: data.bankAccountNumber,
                balance: data.balance,
            },
        });
        expect(result).toEqual(mockAccount);
    });

    // Test createAccount failed case (account with bankAccountNumber already exists)
    test('createAccount should throw an error if account with bankAccountNumber already exists', async () => {
        const existingAccount = { id: 1, userId: 1, bankName: 'Test Bank', bankAccountNumber: '123456', balance: 1000 };
        prisma.bankAccount.findUnique.mockResolvedValue(existingAccount); // Mock existing account

        const data = { userId: 2, bankName: 'Another Bank', bankAccountNumber: '123456', balance: 5000 };

        await expect(AccountService.createAccount(data)).rejects.toThrow('Account with this bank account number already exists');
    });

    // Test createAccount failed case (validation fails)
    test('createAccount should throw a validation error if required fields are missing', async () => {
        const invalidData = { userId: 1 }; // Missing required fields
        await expect(AccountService.createAccount(invalidData)).rejects.toThrow();
    });

    // Test getAllAccounts success case
    test('getAllAccounts should return a list of accounts', async () => {
        const mockAccounts = [{ id: 1, bankName: 'Test Bank', balance: 1000 }];
        prisma.bankAccount.findMany.mockResolvedValue(mockAccounts);

        const result = await AccountService.getAllAccounts();

        expect(prisma.bankAccount.findMany).toHaveBeenCalled();
        expect(result).toEqual(mockAccounts);
    });

    // Test getAccountById success case
    test('getAccountById should return an account by ID', async () => {
        const mockAccount = { id: 1, bankName: 'Test Bank', balance: 1000 };
        prisma.bankAccount.findUnique.mockResolvedValue(mockAccount);

        const result = await AccountService.getAccountById(1);
        expect(prisma.bankAccount.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(result).toEqual(mockAccount);
    });

    // Test getAccountById failed case
    test('getAccountById should return null if account does not exist', async () => {
        prisma.bankAccount.findUnique.mockResolvedValue(null);

        const result = await AccountService.getAccountById(999);
        expect(result).toBeNull();
    });

    // Test withdraw failed case (account not found)
    test('withdraw should throw an error if account not found', async () => {
        prisma.bankAccount.findUnique.mockResolvedValue(null);

        await expect(AccountService.withdraw(1, 100)).rejects.toThrow('Account not found');
    });

    // Test withdraw failed case (balance is insufficient)
    test('withdraw should throw an error if balance is insufficient', async () => {
        const mockAccount = { id: 1, balance: 50 }; // Mock account with low balance
        prisma.bankAccount.findUnique.mockResolvedValue(mockAccount);

        await expect(AccountService.withdraw(1, 100)).rejects.toThrow('Insufficient balance');
    });

    // Test withdraw success case
    test('withdraw should update balance correctly if sufficient', async () => {
        const mockAccount = { id: 1, balance: 1000 };
        prisma.bankAccount.findUnique.mockResolvedValue(mockAccount);
        const updatedAccount = { id: 1, balance: 800 };
        prisma.bankAccount.update.mockResolvedValue(updatedAccount);

        const result = await AccountService.withdraw(1, 200);

        expect(prisma.bankAccount.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { balance: { decrement: 200 } },
        });
        expect(result).toEqual(updatedAccount);
    });

    // Test deposit success case
    test('deposit should update balance correctly', async () => {
        const mockAccount = { id: 1, balance: 1000 };
        prisma.bankAccount.findUnique.mockResolvedValue(mockAccount);
        const updatedAccount = { id: 1, balance: 1500 };
        prisma.bankAccount.update.mockResolvedValue(updatedAccount);

        const result = await AccountService.deposit(1, 500);

        expect(prisma.bankAccount.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { balance: { increment: 500 } },
        });
        expect(result).toEqual(updatedAccount);
    });

    // Test deposit failed case (account not found)
    test('deposit should throw an error if account not found', async () => {
        prisma.bankAccount.findUnique.mockResolvedValue(null);

        await expect(AccountService.deposit(1, 500)).rejects.toThrow('Account not found');
    });

    // Test deleteAccount success case
    test('deleteAccount should delete an account and return it', async () => {
        const mockAccount = { id: 1, bankName: 'Test Bank', balance: 1000 };
        prisma.bankAccount.findUnique.mockResolvedValue(mockAccount);
        prisma.bankAccount.delete.mockResolvedValue(mockAccount);

        const result = await AccountService.deleteAccount(1);

        expect(prisma.bankAccount.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        });
        expect(prisma.bankAccount.delete).toHaveBeenCalledWith({
            where: { id: 1 },
        });
        expect(result).toEqual(mockAccount);
    });

    // Test deleteAccount failed case (account not found)
    test('deleteAccount should throw an error if account not found', async () => {
        prisma.bankAccount.findUnique.mockResolvedValue(null);

        await expect(AccountService.deleteAccount(999)).rejects.toThrow('Account not found');
    });
    
});
