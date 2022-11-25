import express from 'express';
import {
  createTransaction,
  getTransactions,
  getTransactionsUser,
} from '../controllers/transaction.js';
import { verifyUser, verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

// CREATE
router.post('/:id', verifyUser, createTransaction);
router.get('/', verifyAdmin, getTransactions);
router.get('/:id', verifyUser, getTransactionsUser);

export default router;
