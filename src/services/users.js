const Joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    profile: Joi.object({
        identityType: Joi.string().valid('ktp', 'sim', 'passport').required(),
        identityNumber: Joi.string().required(),
        address: Joi.string().required()
    }).required()
});

class UserService {
    async createUser(data) {
        // validasi dengan Joi
        const { error } = userSchema.validate(data);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const { name, email, password, profile } = data;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
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
