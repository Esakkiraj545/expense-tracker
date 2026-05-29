const Trip = require('../models/Trip');
const User = require('../models/User');
const Expense = require('../models/Expense');

exports.createTrip = async (req, res) => {
  try {
    const { 
      tripName, tripType, startDate, endDate, state, destination, 
      image, budget, members, splitMethod, notes 
    } = req.body;

    // Process members: Check if emails already have accounts
    const processedMembers = await Promise.all((members || []).map(async (rawEmail) => {
      const email = rawEmail.trim().toLowerCase();
      // Case-insensitive search for user
      const user = await User.findOne({ email: new RegExp('^' + email + '$', 'i') });
      return {
        email,
        user: user ? user._id : null,
        status: user ? 'joined' : 'pending'
      };
    }));

    const trip = new Trip({
      tripName,
      tripType: tripType || 'solo',
      startDate,
      endDate,
      state,
      destination,
      image,
      budget,
      owner: req.user.id,
      members: tripType === 'solo' ? [] : processedMembers,
      splitMethod: tripType === 'solo' ? 'Equal Split' : splitMethod,
      notes
    });

    await trip.save();
    res.status(201).json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTrips = async (req, res) => {
  try {
    const userEmail = req.user.email.toLowerCase();
    const userEmailRegex = new RegExp('^' + req.user.email + '$', 'i');

    // Auto-link pending invites: If a user has registered/logged in and has pending invites matching their email, update status to 'joined' and link their user ID.
    const tripsToUpdate = await Trip.find({
      'members': { 
        $elemMatch: { 
          email: userEmailRegex, 
          user: null 
        } 
      }
    });

    if (tripsToUpdate.length > 0) {
      for (let trip of tripsToUpdate) {
        let updated = false;
        for (let member of trip.members) {
          if (!member.user && member.email.toLowerCase() === userEmail) {
            member.user = req.user.id;
            member.status = 'joined';
            updated = true;
          }
        }
        if (updated) {
          await trip.save();
        }
      }
    }

    // Fetch trips where user is owner OR a member
    const trips = await Trip.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id },
        { 'members.email': userEmailRegex } // In case user just signed up with invited email
      ]
    }).populate('owner', 'name email profileImage').populate('members.user', 'name email profileImage').sort('-createdAt');

    res.status(200).json({ success: true, count: trips.length, data: trips });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTripById = async (req, res) => {
  try {
    // Self-healing: Check if any pending member has registered in the meantime
    const rawTrip = await Trip.findById(req.params.id);
    if (rawTrip) {
      let updated = false;
      for (let member of rawTrip.members) {
        if (!member.user) {
          const registeredUser = await User.findOne({ email: new RegExp('^' + member.email + '$', 'i') });
          if (registeredUser) {
            member.user = registeredUser._id;
            member.status = 'joined';
            updated = true;
          }
        }
      }
      if (updated) {
        await rawTrip.save();
      }
    }

    const trip = await Trip.findById(req.params.id)
      .populate('owner', 'name email profileImage')
      .populate('members.user', 'name email profileImage');

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Check if user has access
    const userEmailRegex = new RegExp('^' + req.user.email + '$', 'i');
    const isMember = trip.members.some(m => 
      (m.user && m.user._id.toString() === req.user.id) || 
      (m.email && m.email.toLowerCase() === req.user.email.toLowerCase())
    );
    const isOwner = trip.owner._id.toString() === req.user.id;

    if (!isOwner && !isMember) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this trip' });
    }

    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Only the trip owner can delete it
    if (trip.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this trip' });
    }

    // Delete all associated expenses first (cascading delete)
    await Expense.deleteMany({ trip: req.params.id });

    // Delete the trip itself
    await trip.deleteOne();

    res.status(200).json({ success: true, message: 'Trip and associated expenses deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const { 
      tripName, tripType, startDate, endDate, state, destination, 
      image, budget, members, splitMethod, notes 
    } = req.body;

    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Only the trip owner can update the trip details
    if (trip.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this trip' });
    }

    // Process members if provided
    let processedMembers = trip.members;
    if (members) {
      processedMembers = await Promise.all((members || []).map(async (rawEmail) => {
        const email = rawEmail.trim().toLowerCase();
        const existingMember = trip.members.find(m => m.email.toLowerCase() === email);
        if (existingMember) return existingMember;
        
        const user = await User.findOne({ email: new RegExp('^' + email + '$', 'i') });
        return {
          email,
          user: user ? user._id : null,
          status: user ? 'joined' : 'pending'
        };
      }));
    }

    trip.tripName = tripName || trip.tripName;
    trip.tripType = tripType || trip.tripType;
    trip.startDate = startDate || trip.startDate;
    trip.endDate = endDate || trip.endDate;
    trip.state = state !== undefined ? state : trip.state;
    trip.destination = destination !== undefined ? destination : trip.destination;
    trip.image = image || trip.image;
    trip.budget = budget !== undefined ? parseFloat(budget) : trip.budget;
    trip.members = trip.tripType === 'solo' ? [] : processedMembers;
    trip.splitMethod = trip.tripType === 'solo' ? 'Equal Split' : (splitMethod || trip.splitMethod);
    trip.notes = notes !== undefined ? notes : trip.notes;

    await trip.save();
    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
