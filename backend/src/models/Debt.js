const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    default: 'Cash'
  },
  note: {
    type: String
  }
});

const debtSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  personName: {
    type: String,
    required: [true, 'Please add a person name']
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount']
  },
  remainingAmount: {
    type: Number
  },
  type: {
    type: String,
    enum: ['Lent', 'Borrowed'],
    required: [true, 'Please specify if it is Lent or Borrowed']
  },
  category: {
    type: String,
    default: 'General'
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  },
  paymentMethod: {
    type: String,
    default: 'Cash'
  },
  reminderEnabled: {
    type: Boolean,
    default: false
  },
  reminderDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Pending', 'Settled'],
    default: 'Pending'
  },
  payments: [paymentSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Debt', debtSchema);
