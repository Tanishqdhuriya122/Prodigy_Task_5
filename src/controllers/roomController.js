const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');

/**
 * Helper: check overlap using MongoDB query:
 * We want no booking where:
 *   booking.endDate > requested.startDate AND booking.startDate < requested.endDate
 * This handles exclusive end semantics; adjust if you treat endDate inclusive.
 */

exports.createRoom = async (req, res, next) => {
  try {
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { hotelId, title, description, pricePerNight, capacity, amenities } = req.body;
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    if (!hotel.owner.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const room = await Room.create({
      hotel: hotel._id,
      owner: hotel.owner,
      title,
      description,
      pricePerNight,
      capacity,
      amenities: Array.isArray(amenities) ? amenities : []
    });

    res.status(201).json(room);
  } catch (err) { next(err); }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (!room.owner.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    Object.assign(room, req.body);
    await room.save();
    res.json(room);
  } catch (err) { next(err); }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (!room.owner.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    await room.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

// Search & filter rooms: by city, date range availability, price range, capacity
exports.searchRooms = async (req, res, next) => {
  try {
    const { city, startDate, endDate, minPrice, maxPrice, capacity } = req.query;
    const filter = { isActive: true };
    const hotelFilter = {};

    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = parseFloat(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = parseFloat(maxPrice);
    }
    if (capacity) filter.capacity = { $gte: parseInt(capacity) };

    // If city provided, find hotels in that city and filter rooms by hotel IDs
    let hotelIds = null;
    if (city) {
      const hotels = await Hotel.find({ city: new RegExp(city, 'i') }, { _id: 1 });
      hotelIds = hotels.map(h => h._id);
      if (hotelIds.length === 0) return res.json([]); // no hotels -> no rooms
      filter.hotel = { $in: hotelIds };
    }

    // fetch candidate rooms
    const rooms = await Room.find(filter).populate('hotel').lean();

    // if date range provided, filter using Booking collection for overlapping bookings
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      if (s >= e) return res.status(400).json({ message: 'endDate must be after startDate' });

      // We will for each room check if any confirmed booking overlaps:
      // Overlap condition: booking.endDate > s AND booking.startDate < e  (if end exclusive)
      const available = [];
      for (const r of rooms) {
        const overlap = await Booking.findOne({
          room: r._id,
          status: 'confirmed',
          $expr: {
            $and: [
              { $gt: ['$endDate', s] },
              { $lt: ['$startDate', e] }
            ]
          }
        }).lean();

        // Note: Mongoose doesn't directly accept $expr with external vars easily in this findOne call,
        // so we use a standard condition instead:
        const overlap2 = await Booking.findOne({
          room: r._id,
          status: 'confirmed',
          startDate: { $lt: e },
          endDate: { $gt: s }
        }).lean();

        if (!overlap2) available.push(r);
      }
      return res.json(available);
    }

    res.json(rooms);
  } catch (err) { next(err); }
};
