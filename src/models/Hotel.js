const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hotelSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  address: { type: String },
  city: { type: String, index: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
