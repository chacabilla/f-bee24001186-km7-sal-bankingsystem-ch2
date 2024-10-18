const express = require('express');
const router = express.Router();
const userService = require('../services/users');

router.post('/', async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.userId);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
