const Expense = require('../models/Expense');

// @desc    Add new expense
// @route   POST /api/v1/expenses
// @access  Private
exports.addExpense = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const expense = await Expense.create(req.body);

    res.status(201).json({
      success: true,
      data: expense
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all expenses for a user
// @route   GET /api/v1/expenses
// @access  Private
exports.getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort('-date');

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (err) {
    next(err);
  }
};
