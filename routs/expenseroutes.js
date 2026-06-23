const express = require('express');
const router = express.Router();

const { getExpenses, getExpenseById , insertExpense, updateExpense, updateStatus } = require('../controllers/expenseControllers');

router.get('/', getExpenses);
router.get('/:id', getExpenseById);
router.post('/', insertExpense);
router.put('/:id', updateExpense);
router.put('/status/:id', updateStatus);

module.exports = router;