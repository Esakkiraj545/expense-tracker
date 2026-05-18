const express = require('express');
const router = express.Router();
const {
  addDebt,
  getDebts,
  getDebt,
  updateDebt,
  deleteDebt,
  recordPayment
} = require('../controllers/debtController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addDebt)
  .get(protect, getDebts);

router.route('/:id/pay')
  .post(protect, recordPayment);

router.route('/:id')
  .get(protect, getDebt)
  .put(protect, updateDebt)
  .delete(protect, deleteDebt);

module.exports = router;
