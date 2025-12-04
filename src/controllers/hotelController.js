const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const { validationResult } = require('express-validator');

exports.createHotel = async (req, res, next) => {
  try {
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    const { name, description, address, city } = req.body;
    const hotel = await Hotel.create({ name, description, address, city, owner: req.user._id });
    res.status(201).json(hotel);
  } catch (err) { next(err); }
};

exports.updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Not found' });
    if (!hotel.owner.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    Object.assign(hotel, req.body);
    await hotel.save();
    res.json(hotel);
  } catch (err) { next(err); }
};

exports.deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Not found' });
    if (!hotel.owner.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    await Room.deleteMany({ hotel: hotel._id }); // cleanup rooms
    await hotel.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

exports.listHotels = async (req, res, next) => {
  try {
    // include sample of rooms for each hotel if requested (optional)
    const hotels = await Hotel.find().lean();
    res.json(hotels);
  } catch (err) { next(err); }
};
