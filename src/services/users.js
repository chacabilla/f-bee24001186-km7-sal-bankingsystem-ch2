require('dotenv').config();
import Joi from 'joi';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'; 

const prisma = new PrismaClient();

const emailSchema = Joi.object({
    email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
});

const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    profile: Joi.object({
        identityType: Joi.string().valid('ktp', 'sim', 'passport').required(),
        identityNumber: Joi.string().required(),
        address: Joi.string().required(),
    }).required(),
});

class UserService {
    async sendPasswordResetEmail(email, resetUrl) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
            port: parseInt(process.env.SMTP_PORT || '2525'),
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            html: `
                <h3>Click the link below to reset your password:</h3>
                <a href="${resetUrl}">Reset Password</a>
            `,
        };

        await transporter.sendMail(mailOptions);
    }

    async createUser(data) {
        const { error } = userSchema.validate(data);
        if (error) {
            throw new Error(`Validation Error: ${error.details[0].message}`);
        }

        const { name, email, password, profile } = data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    profile: {
                        create: profile,
                    },
                },
            });

            return user;
        } catch (err) {
            throw new Error(`Database Error: ${err.message}`);
        }
    }

    async forgotPassword(email) {
        const { error } = emailSchema.validate({ email });
        if (error) {
            console.log('Validation error:', error);
            throw new Error(`Validation Error: ${error.details[0].message}`);
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true },
        });

        if (!user) {
            throw new Error('User not found');
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_RESET_SECRET, { expiresIn: '1d' });
        console.log('Generated token:', token);
        const resetUrl = `${process.env.BASE_URL_FRONTEND}/reset-password/${token}`;

        await this.sendPasswordResetEmail(user.email, resetUrl);

        return { message: 'Password reset link has been sent to your email' };
    }

    async resetPassword(token, newPassword) {
        const { error } = resetPasswordSchema.validate({ token, newPassword });
        if (error) {
            throw new Error(`Validation Error: ${error.details[0].message}`);
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
        } catch (err) {
            throw new Error(`error: ${err.message}`);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: decoded.userId },
            data: { password: hashedPassword },
        });

        return { message: 'Password successfully reset' };
    }

    async getAllUsers() {
        return await prisma.user.findMany({
            include: { profile: true },
        });
    }

    async getUserById(userId) {
        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            include: { profile: true },
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }
}

export default new UserService();
