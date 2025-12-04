const { body } = require('express-validator');

exports.createRoom = [
  body('hotelId').isMongoId().withMessage('hotelId invalid'),
  body('title').isLength({ min: 2 }),
  body('pricePerNight').isFloat({ gt: 0 }),
  body('capacity').isInt({ gt: 0 })
];

exports.updateRoom = [
  body('title').optional().isString(),
  body('pricePerNight').optional().isFloat({ gt: 0 })
];
