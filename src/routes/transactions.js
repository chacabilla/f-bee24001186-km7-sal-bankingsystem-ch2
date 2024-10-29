const express = require('express');
const router = express.Router();
const transactionService = require('../services/transactions');

router.post('/', async (req, res) => {
    try {
        const transaction = await transactionService.createTransaction(req.body);
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});;

router.get('/', async (req, res) => {
    try {
        const transactions = await transactionService.getAllTransactions();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:transactionId', async (req, res) => {
    try {
        const transaction = await transactionService.getTransactionById(req.params.transactionId);
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
