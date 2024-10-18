const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UserService {
    async createUser(data) {
        const { name, email, password, profile } = data;
        try {
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password,
                    profile: {
                        create: profile
                    }
                }
            });
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllUsers() {
        const users = await prisma.user.findMany({
            include: { profile: true }
        });
        return users;
    }

    async getUserById(userId) {
        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            include: { profile: true }
        });
        return user;
    }
}

module.exports = new UserService();
