const Expense = require('../models/Expense');
const Trip = require('../models/Trip');
const Notification = require('../models/Notification');

// @desc    Add new expense and update trip total
exports.addExpense = async (req, res) => {
  try {
    const { trip, amount, category, paymentMethod, date, note, attachment, paidBy } = req.body;

    const expense = await Expense.create({
      paidBy: paidBy || req.user.id,
      trip,
      amount,
      category,
      paymentMethod,
      date,
      note,
      attachment
    });

    // Update totalExpenses in the Trip model
    const tripDetails = await Trip.findByIdAndUpdate(trip, {
      $inc: { totalExpenses: amount }
    }, { new: true });

    // Trigger collaborative notifications for all other trip members & owner
    if (tripDetails) {
      const usersToNotify = [];
      
      if (tripDetails.owner && tripDetails.owner.toString() !== req.user.id) {
        usersToNotify.push(tripDetails.owner.toString());
      }
      
      tripDetails.members.forEach(member => {
        if (member.user && member.user.toString() !== req.user.id && member.status === 'joined') {
          usersToNotify.push(member.user.toString());
        }
      });

      // Remove duplicates
      const uniqueUsers = [...new Set(usersToNotify)];

      // Create Notification documents for each user
      await Promise.all(uniqueUsers.map(userId => 
        Notification.create({
          user: userId,
          title: 'New Trip Expense Added',
          message: `${req.user.name} added a new shared expense of ₹${amount} under '${category}' to the trip '${tripDetails.tripName}'.`,
          type: 'TripExpense'
        })
      ));
    }

    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all expenses for a specific trip
exports.getTripExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ trip: req.params.tripId })
      .populate('paidBy', 'name email')
      .sort('-date');

    res.status(200).json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete expense and update trip total
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Deduct amount from Trip total
    await Trip.findByIdAndUpdate(expense.trip, {
      $inc: { totalExpenses: -expense.amount }
    });

    await expense.deleteOne();
    res.status(200).json({ success: true, message: 'Expense removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all expenses across all trips the user is part of
exports.getExpenses = async (req, res) => {
  try {
    // Find all trips where user is owner or member
    const trips = await Trip.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id },
        { 'members.email': req.user.email }
      ]
    });

    const tripIds = trips.map(trip => trip._id);

    // Find all expenses for these trips
    const expenses = await Expense.find({ trip: { $in: tripIds } })
      .populate('paidBy', 'name email')
      .sort('-date');

    res.status(200).json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

