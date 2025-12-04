const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createBooking, cancelBooking, listUserBookings } = require('../controllers/bookingController');
const { createBooking: createBookingVal } = require('../validators/bookingValidators');

router.post('/', auth, createBookingVal, createBooking);
router.delete('/:id', auth, cancelBooking);
router.get('/', auth, listUserBookings);

module.exports = router;
