const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const auth = require('../middleware/auth');

// All reservation endpoints are protected by auth middleware
router.use(auth);

// @route   POST /api/reservations
// @desc    Create a new table reservation
// @access  Private
router.post('/', reservationController.createReservation);

// @route   GET /api/reservations/my-bookings
// @desc    Get user's reservation history
// @access  Private
router.get('/my-bookings', reservationController.getMyBookings);

module.exports = router;
