const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
 // pastikan ini mengarah ke file prisma yang benar
const UserService = require('../users');

jest.mock('bcryptjs');
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        user: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('UserService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('createUser should hash password and create a user', async () => {
        const mockUser = { 
            id: 1, 
            name: 'John Doe', 
            email: 'john@example.com',
            profile: {
                identityType: 'ktp',
                identityNumber: '123456789',
                address: '123 Main St'
            }
        };
        bcrypt.hash.mockResolvedValue('hashedPassword');
        prisma.user.create.mockResolvedValue(mockUser);
    
        const data = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            profile: {
                identityType: 'ktp',
                identityNumber: '123456789',
                address: '123 Main St'
            } // Sertakan struktur profile yang sesuai
        };
        
        const result = await UserService.createUser(data);
        expect(result).toEqual(mockUser);
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(prisma.user.create).toHaveBeenCalledWith({
            data: {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'hashedPassword',
                profile: {
                    create: {
                        identityType: 'ktp',
                        identityNumber: '123456789',
                        address: '123 Main St'
                    }
                }
            },
        });
    });

    test('createUser should throw an error if validation fails', async () => {
        const data = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'pass', // terlalu pendek, seharusnya 6 karakter
            profile: {
                identityType: 'ktp',
                identityNumber: '123456',
                address: 'Some Address'
            }
        };
    
        await expect(UserService.createUser(data)).rejects.toThrow('\"password\" length must be at least 6 characters long');
    });
    
    test('getUserById should return null if user not found', async () => {
        prisma.user.findUnique.mockResolvedValue(null); // Mock untuk tidak menemukan user
        
        const result = await UserService.getUserById(999); // ID yang tidak ada
        expect(result).toBeNull(); // Pastikan hasilnya null
    });

    test('getAllUsers should return a list of users', async () => {
        const mockUsers = [
            {
                id: 1,
                name: 'John Doe',
                profile: {
                    identityType: 'ktp',
                    identityNumber: '123456789',
                    address: '123 Main St'
                }
            },
            {
                id: 2,
                name: 'Jane Doe',
                profile: {
                    identityType: 'sim',
                    identityNumber: '987654321',
                    address: '456 Side St'
                }
            }
        ];
        prisma.user.findMany.mockResolvedValue(mockUsers);

        const result = await UserService.getAllUsers();
        expect(result).toEqual(mockUsers);
        expect(prisma.user.findMany).toHaveBeenCalledWith({
            include: { profile: true }
        });
    });

    test('getUserById should return a user by ID', async () => {
        const mockUser = {
            id: 1,
            name: 'John Doe',
            profile: {
                identityType: 'ktp',
                identityNumber: '123456789',
                address: '123 Main St'
            }
        };
        prisma.user.findUnique.mockResolvedValue(mockUser);

        const result = await UserService.getUserById(1);
        expect(result).toEqual(mockUser);
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include: { profile: true }
        });
    });

    test('getUserById should return null if user not found', async () => {
        prisma.user.findUnique.mockResolvedValue(null); // Mock untuk tidak menemukan user
        
        const result = await UserService.getUserById(999); // ID yang tidak ada
        expect(result).toBeNull(); // Pastikan hasilnya null
    });
    
});
