const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createHotel, updateHotel, deleteHotel, listHotels } = require('../controllers/hotelController');
const { createHotel: hotelValidator } = require('../validators/hotelValidators');

router.get('/', listHotels);
router.post('/', auth, hotelValidator, createHotel);
router.put('/:id', auth, updateHotel);
router.delete('/:id', auth, deleteHotel);

module.exports = router;
