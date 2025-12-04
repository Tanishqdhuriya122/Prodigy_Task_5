const { body } = require('express-validator');

exports.createBooking = [
  body('roomId').isMongoId().withMessage('roomId invalid'),
  body('startDate').isISO8601().withMessage('startDate invalid'),
  body('endDate').isISO8601().withMessage('endDate invalid')
];
