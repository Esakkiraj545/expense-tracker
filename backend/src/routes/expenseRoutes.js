const express = require('express');
const { addExpense, getTripExpenses, deleteExpense, getExpenses, updateExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(addExpense)
  .get(getExpenses);
router.route('/trip/:tripId').get(getTripExpenses);
router.route('/:id').delete(deleteExpense).put(updateExpense);

module.exports = router;
