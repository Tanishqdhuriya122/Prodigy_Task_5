const { body } = require('express-validator');

exports.createHotel = [
  body('name').isLength({ min: 2 }).withMessage('Name required'),
  body('city').optional().isString()
];
