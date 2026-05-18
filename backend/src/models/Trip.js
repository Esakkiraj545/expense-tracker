const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  tripName: {
    type: String,
    required: true,
    trim: true
  },
  tripType: {
    type: String,
    enum: ['solo', 'couple', 'friends', 'colleagues'],
    default: 'solo'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: () => new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
  },
  state: {
    type: String,
    default: ''
  },
  destination: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b'
  },
  budget: {
    type: Number,
    default: 0
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    email: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'joined'], default: 'pending' }
  }],
  splitMethod: {
    type: String,
    enum: ['Equal Split', 'Percentage Split', 'Custom Split'],
    default: 'Equal Split'
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed'],
    default: 'upcoming'
  },
  totalExpenses: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
