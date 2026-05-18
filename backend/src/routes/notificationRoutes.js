const express = require('express');
const { getNotifications, markAllRead, clearNotifications } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getNotifications)
  .delete(clearNotifications);

router.put('/mark-read', markAllRead);

module.exports = router;
