const express = require('express');
const router = express.Router();
const accountService = require('../services/accounts');

router.post('/', async (req, res) => {
    try {
        const account = await accountService.createAccount(req.body);
        res.json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const accounts = await accountService.getAllAccounts();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:accountId', async (req, res) => {
    try {
        const account = await accountService.getAccountById(req.params.accountId);
        res.json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id/withdraw', async (req, res) => {
    try {
        const updatedAccount = await accountService.withdraw(req.params.id, req.body.amount);
        res.json(updatedAccount);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id/deposit', async (req, res) => {
    try {
        const updatedAccount = await accountService.deposit(req.params.id, req.body.amount);
        res.json(updatedAccount);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:accountId', async (req, res) => {
    try {
        const deletedAccount = await accountService.deleteAccount(req.params.accountId);
        res.json(deletedAccount);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
