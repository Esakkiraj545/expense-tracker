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
    const processedMembers = await Promise.all((members || []).map(async (email) => {
      const user = await User.findOne({ email });
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
    // Auto-link pending invites: If a user has registered/logged in and has pending invites matching their email, update status to 'joined' and link their user ID.
    await Trip.updateMany(
      { 
        'members.email': req.user.email,
        'members.user': null
      },
      {
        $set: { 
          'members.$[elem].user': req.user.id,
          'members.$[elem].status': 'joined'
        }
      },
      {
        arrayFilters: [{ 'elem.email': req.user.email, 'elem.user': null }]
      }
    );

    // Fetch trips where user is owner OR a member
    const trips = await Trip.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id },
        { 'members.email': req.user.email } // In case user just signed up with invited email
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
          const registeredUser = await User.findOne({ email: member.email });
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
    const isMember = trip.members.some(m => m.user?.toString() === req.user.id || m.email === req.user.email);
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
      processedMembers = await Promise.all((members || []).map(async (email) => {
        const existingMember = trip.members.find(m => m.email === email);
        if (existingMember) return existingMember;
        
        const user = await User.findOne({ email });
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
