const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { validationResult } = require('express-validator');

// nights calc (endDate exclusive)
function calcNights(startDate, endDate) {
  const s = new Date(startDate);
  const e = new Date(endDate);
  const diff = Math.ceil((e - s) / (1000*60*60*24));
  return diff;
}

exports.createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { roomId, startDate, endDate } = req.body;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const s = new Date(startDate);
    const e = new Date(endDate);
    if (s >= e) return res.status(400).json({ message: 'endDate must be after startDate' });

    // Overlap check: find any confirmed booking where startDate < e AND endDate > s
    const overlapping = await Booking.findOne({
      room: room._id,
      status: 'confirmed',
      startDate: { $lt: e },
      endDate: { $gt: s }
    });

    if (overlapping) return res.status(400).json({ message: 'Room is already booked for the selected dates' });

    const nights = calcNights(s, e);
    const totalPrice = Number((room.pricePerNight * nights).toFixed(2));

    const booking = await Booking.create({
      user: req.user._id,
      room: room._id,
      startDate: s,
      endDate: e,
      totalPrice
    });

    res.status(201).json(booking);
  } catch (err) { next(err); }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });
    if (!booking.user.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Cancelled', booking });
  } catch (err) { next(err); }
};

exports.listUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('room').populate('user');
    res.json(bookings);
  } catch (err) { next(err); }
};
