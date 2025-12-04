const { body } = require('express-validator');

exports.registerValidator = [
  body('name').isLength({ min: 2 }).withMessage('Name min 2 chars'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars')
];

exports.loginValidator = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').exists().withMessage('Password required')
];
