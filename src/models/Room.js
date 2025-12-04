const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // same as hotel.owner
  title: { type: String, required: true },
  description: { type: String },
  pricePerNight: { type: Number, required: true },
  capacity: { type: Number, default: 1 },
  amenities: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
