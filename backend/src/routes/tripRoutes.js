const express = require('express');
const router = express.Router();
const { createTrip, getTrips, getTripById, deleteTrip, updateTrip } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All trip routes need authentication

router.post('/', createTrip);
router.get('/', getTrips);
router.get('/:id', getTripById);
router.delete('/:id', deleteTrip);
router.put('/:id', updateTrip);

module.exports = router;
