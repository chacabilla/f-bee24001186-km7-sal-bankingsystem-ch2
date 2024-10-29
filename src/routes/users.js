const express = require('express');
const router = express.Router();
const userService = require('../services/users');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST: create a new user
router.post('/register', async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET: get all users
router.get('/', async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: get a user by ID
router.get('/:userId', async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.userId);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST: login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique(
            { where: { email } }
        );
        if (!user || !(await bcrypt.compare(password, user.password))) { 
            return res.status(404).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user.id }, 'secret', { expiresIn: '64h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
