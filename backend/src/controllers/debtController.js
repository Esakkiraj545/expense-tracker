const Debt = require('../models/Debt');
const Notification = require('../models/Notification');

// @desc    Add new debt
// @route   POST /api/v1/debts
// @access  Private
const addDebt = async (req, res, next) => {
  try {
    const { personName, amount, type, notes, date, paymentMethod, reminderEnabled, reminderDate } = req.body;

    if (!personName || !amount || !type) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const debt = await Debt.create({
      user: req.user.id,
      personName,
      amount,
      remainingAmount: amount, // Initialize balance to full amount
      type,
      notes,
      date: date || Date.now(),
      paymentMethod: paymentMethod || 'Cash',
      reminderEnabled: reminderEnabled || false,
      reminderDate
    });

    if (reminderEnabled) {
      await Notification.create({
        user: req.user.id,
        title: 'Repayment Reminder Set',
        message: `You scheduled a repayment reminder for your ${type.toLowerCase()} record of ₹${amount} with ${personName} on ${new Date(reminderDate).toLocaleDateString()}.`,
        type: 'DebtReminder'
      });
    }

    res.status(201).json({
      success: true,
      data: debt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all debts for user
// @route   GET /api/v1/debts
// @access  Private
const getDebts = async (req, res, next) => {
  try {
    const debts = await Debt.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: debts.length,
      data: debts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single debt
// @route   GET /api/v1/debts/:id
// @access  Private
const getDebt = async (req, res, next) => {
  try {
    const debt = await Debt.findById(req.params.id);

    if (!debt) {
      return res.status(404).json({ success: false, message: 'Debt not found' });
    }

    // Make sure user owns debt
    if (debt.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      data: debt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update debt
// @route   PUT /api/v1/debts/:id
// @access  Private
const updateDebt = async (req, res, next) => {
  try {
    let debt = await Debt.findById(req.params.id);

    if (!debt) {
      return res.status(404).json({ success: false, message: 'Debt not found' });
    }

    // Make sure user owns debt
    if (debt.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    debt = await Debt.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: debt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete debt
// @route   DELETE /api/v1/debts/:id
// @access  Private
const deleteDebt = async (req, res, next) => {
  try {
    const debt = await Debt.findById(req.params.id);

    if (!debt) {
      return res.status(404).json({ success: false, message: 'Debt not found' });
    }

    // Make sure user owns debt
    if (debt.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await debt.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record a payment for a debt
// @route   POST /api/v1/debts/:id/pay
// @access  Private
const recordPayment = async (req, res, next) => {
  try {
    const { amount, paymentMethod, note } = req.body;
    
    let debt = await Debt.findById(req.params.id);

    if (!debt) {
      return res.status(404).json({ success: false, message: 'Debt not found' });
    }

    if (debt.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const payAmount = parseFloat(amount);
    
    // Safety check for older records that might not have remainingAmount set
    if (debt.remainingAmount === undefined || debt.remainingAmount === null) {
      debt.remainingAmount = debt.amount || 0;
    }

    if (isNaN(payAmount) || payAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid amount' });
    }

    if (payAmount > debt.remainingAmount) {
      return res.status(400).json({ 
        success: false, 
        message: `Payment amount (₹${payAmount}) exceeds remaining balance (₹${debt.remainingAmount})` 
      });
    }

    // Ensure payments array exists
    if (!debt.payments) {
      debt.payments = [];
    }

    // Add payment to array
    debt.payments.push({
      amount: payAmount,
      paymentMethod: paymentMethod || 'Cash',
      note: note || '',
      date: new Date()
    });

    // Update remaining amount
    debt.remainingAmount = (debt.remainingAmount || 0) - payAmount;

    // Check if fully settled
    if (debt.remainingAmount <= 0) {
      debt.remainingAmount = 0;
      debt.status = 'Settled';
    }

    await debt.save();

    res.status(200).json({
      success: true,
      data: debt
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addDebt,
  getDebts,
  getDebt,
  updateDebt,
  deleteDebt,
  recordPayment
};
