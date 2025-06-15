const { body, validationResult } = require('express-validator');

const validationRegistration = [
  body("email")
    .isString().withMessage('The field is not a string')
    .trim()
    .notEmpty().withMessage("The field is empty"),
  body("login")
    .isString().withMessage('The field is not a string')
    .trim()
    .notEmpty().withMessage("The field is empty"),
  body("password")
    .isString().withMessage('The field is not a string')
    .trim()
    .notEmpty().withMessage("The field is empty"),
  body("role")
    .optional()
    .isIn(['client', 'coach']).withMessage('Role must be either client or coach'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validationAuthorization = [
  body("login")
    .isString().withMessage('The field is not a string')
    .trim()
    .notEmpty().withMessage("The field is empty"),
  body("password")
    .isString().withMessage('The field is not a string')
    .trim()
    .notEmpty().withMessage("The field is empty"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validationRegistration, validationAuthorization };
