const { body, validationResult } = require('express-validator');

const validateRegister = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
];

const validateProvider = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
  body('category').isIn(['Doctor', 'Electrician', 'Plumber', 'Tutor', 'Helper', 'Mechanic', 'Carpenter', 'Other']).withMessage('Invalid category'),
  body('contact').isMobilePhone('en-IN').withMessage('Please provide a valid Indian mobile number'),
  body('location.pincode').isLength({ min: 6, max: 6 }).withMessage('Pincode must be 6 digits')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateProvider,
  handleValidationErrors
};
