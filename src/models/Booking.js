const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['confirmed','cancelled'], default: 'confirmed' }
}, { timestamps: true });

// Optional: index for efficient overlap queries
bookingSchema.index({ room: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
