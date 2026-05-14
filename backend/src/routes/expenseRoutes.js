const express = require('express');
const { addExpense, getExpenses } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All expense routes are protected

router.route('/')
  .get(getExpenses)
  .post(addExpense);

module.exports = router;
