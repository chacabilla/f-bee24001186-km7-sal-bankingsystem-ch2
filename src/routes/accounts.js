const express = require('express');
const router = express.Router();
const accountService = require('../services/accounts');
const authMiddleware = require('../middleware/auth');

// POST: create a new account
router.post('/', async (req, res) => {
    try {
        const account = await accountService.createAccount(req.body);
        res.json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: get all accounts
router.get('/', authMiddleware, async (req, res) => {
    try {
        const accounts = await accountService.getAllAccounts();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: get an account by ID
router.get('/:accountId', authMiddleware, async (req, res) => {
    try {
        const account = await accountService.getAccountById(req.params.accountId);
        res.json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT: withdraw from an account
router.put('/:id/withdraw', async (req, res) => {
    try {
        const updatedAccount = await accountService.withdraw(req.params.id, req.body.amount);
        res.json(updatedAccount);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT: deposit to an account
router.put('/:id/deposit', async (req, res) => {
    try {
        const updatedAccount = await accountService.deposit(req.params.id, req.body.amount);
        res.json(updatedAccount);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE: delete an account
router.delete('/:accountId', async (req, res) => {
    try {
        const deletedAccount = await accountService.deleteAccount(req.params.accountId);
        res.json(deletedAccount);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
