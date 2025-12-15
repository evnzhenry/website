const { body } = require('express-validator');

const loanValidation = [
  body('fullName').isLength({ min: 2 }).trim().escape(),
  body('dateOfBirth').isDate(),
  body('gender').isIn(['male','female','other']),
  body('primaryPhone').isLength({ min: 7 }).trim(),
  body('email').isEmail().normalizeEmail(),
  body('streetAddress').isLength({ min: 5 }).trim().escape(),
  body('city').isLength({ min: 2 }).trim().escape(),
  body('state').isLength({ min: 2 }).trim().escape(),
  body('zipCode').isLength({ min: 4 }).trim().escape(),
  body('loanAmount').isFloat({ min: 1000, max: 100000 }),
  body('loanPurpose').isLength({ min: 3 }).trim().escape()
];

module.exports = { loanValidation };
