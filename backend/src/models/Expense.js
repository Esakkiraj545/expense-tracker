const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: String,
    default: '0',
  },
  category: {
    type: String,
    default: 'Uncategorized',
  },
  otherCategory: {
    type: String,
    default: '',
  },
  note: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    default: 'Cash',
  },
  attachment: {
    type: String, // Store image URL or base64
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Expense', expenseSchema);
