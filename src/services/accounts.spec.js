const AccountService = require('./accounts');
const { PrismaClient } = require('@prisma/client');

// Buat mock untuk PrismaClient
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

    test('createAccount should throw an error if creation fails', async () => {
        prisma.bankAccount.create.mockRejectedValue(new Error('Account already exists'));

        const data = { userId: 1, bankName: 'Test Bank', bankAccountNumber: '123456', balance: 1000 };
        
        await expect(AccountService.createAccount(data)).rejects.toThrow('Account already exists');
    });

    test('getAllAccounts should return a list of accounts', async () => {
        const mockAccounts = [{ id: 1, bankName: 'Test Bank', balance: 1000 }];
        prisma.bankAccount.findMany.mockResolvedValue(mockAccounts);

        const result = await AccountService.getAllAccounts();

        expect(prisma.bankAccount.findMany).toHaveBeenCalled();
        expect(result).toEqual(mockAccounts);
    });

    test('getAccountById should return an account by ID', async () => {
        const mockAccount = { id: 1, bankName: 'Test Bank', balance: 1000 };
        prisma.bankAccount.findUnique.mockResolvedValue(mockAccount);

        const result = await AccountService.getAccountById(1);
        expect(prisma.bankAccount.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(result).toEqual(mockAccount);
    });

    test('withdraw should throw error if balance is insufficient', async () => {
        prisma.bankAccount.findUnique.mockResolvedValue({ id: 1, balance: 500 });

        await expect(AccountService.withdraw(1, 1000)).rejects.toThrow('Insufficient balance');
        expect(prisma.bankAccount.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    test('withdraw should update balance correctly if sufficient', async () => {
        const mockAccount = { id: 1, balance: 1000 };
        prisma.bankAccount.findUnique.mockResolvedValue(mockAccount);
        const updatedAccount = { id: 1, balance: 800 }; // Update saldo sesuai dengan penarikan
        prisma.bankAccount.update.mockResolvedValue(updatedAccount);
    
        const result = await AccountService.withdraw(1, 200); // Menarik 200
    
        expect(prisma.bankAccount.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { balance: { decrement: 200 } }, // Ini harus tetap
        });
        expect(result).toEqual(updatedAccount); // Pastikan hasilnya benar
    });

    test('deposit should update balance correctly', async () => {
        const updatedAccount = { id: 1, balance: 1500 };
        prisma.bankAccount.update.mockResolvedValue(updatedAccount);

        const result = await AccountService.deposit(1, 500);

        expect(prisma.bankAccount.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { balance: { increment: 500 } },
        });
        expect(result).toEqual(updatedAccount);
    });

    test('deleteAccount should delete an account and return it', async () => {
        const mockDeletedAccount = { id: 1, bankName: 'Test Bank', balance: 1000 };
        prisma.bankAccount.delete.mockResolvedValue(mockDeletedAccount); // Mock return value untuk delete

        const result = await AccountService.deleteAccount(1);

        expect(prisma.bankAccount.delete).toHaveBeenCalledWith({
            where: { id: 1 },
        });
        expect(result).toEqual(mockDeletedAccount);
    });
});
