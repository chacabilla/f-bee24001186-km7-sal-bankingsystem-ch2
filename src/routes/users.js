import { Router } from 'express';
import userService from '../services/users.js';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Notification } from '../libs/socket.js';

const router = Router();
const prisma = new PrismaClient();

// POST: Register a new user
router.post('/register', async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        Notification.push('notifications', 'A new user has registered!');
        res.status(201).json(user);
    } catch (error) {
        console.error('Error in /register:', error.message);
        res.status(400).json({ error: error.message });
    }
});


// GET: Forgot password page
router.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});

// POST: Forgot password
router.post('/forgot-password', async (req, res) => {
    try {
        const response = await userService.forgotPassword(req.body.email);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error in /forgot-password:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// GET: Reset password page
router.get('/reset-password', (req, res) => {
    const { token } = req.query;
    res.render('reset-password', { token });
});

// POST: Reset password
router.post('/reset-password/:token', async (req, res) => {
    try {
        const token  = req.params.token;
        const { newPassword } = req.body;

        const response = await userService.resetPassword(token, newPassword);
        Notification.push('notifications', 'Password reset successful!');
        res.status(200).json({ message: response.message });
    } catch (error) {
        console.error('Error in /reset-password:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// GET: Fetch all users
router.get('/', async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error in /users:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// GET: Fetch a user by ID
router.get('/:userId', async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' }); // HTTP 404: Not Found
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error in /users/:userId:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// POST: Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email and password
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcryptjs.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password' }); // HTTP 401: Unauthorized
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_TOKEN, { expiresIn: '64h' });
        res.status(200).json({ token }); // HTTP 200: OK
    } catch (error) {
        console.error('Error in /login:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
