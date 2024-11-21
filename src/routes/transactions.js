import { Router } from 'express';
const router = Router();
import transactionService from '../services/transactions.js';

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

export default router;
