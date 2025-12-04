const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createRoom, updateRoom, deleteRoom, searchRooms } = require('../controllers/roomController');
const { createRoom: createRoomVal, updateRoom: updateRoomVal } = require('../validators/roomValidators');

router.get('/search', searchRooms);
router.post('/', auth, createRoomVal, createRoom);
router.put('/:id', auth, updateRoomVal, updateRoom);
router.delete('/:id', auth, deleteRoom);

module.exports = router;
