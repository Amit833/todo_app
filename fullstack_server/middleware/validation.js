const { body, validationResult } = require('express-validator');
const customError = require('../helpers/customError');

exports.validateTodo = (req, res, next) => {
  console.log('This comes from the custom middleware', req.body);
  const todo = req.body;
  if (todo.text && todo.userId) next();
  else {
    // We will create an error with a message
    const error = new Error(`Your todo does not contain a text field`);
    error.status = 400;
    // We will call the error handler
    next(error);
  }
};

// User Validation and Sanitization
// Array of rules

exports.userValidationRules = () => {
  return [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Your email address is not valid')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Suuuuper small password (min 8)')
      .bail()
      .custom((value) => {
        // //value is password in the body
        // * Passwords must be
        // * - At least 8 characters long, max length anything
        // * - Include at least 1 lowercase letter
        // * - 1 capital letter
        // * - 1 number
        // * - 1 special character => !@#$%^&*
        const regex = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/;
        //returns a boolean
        const res = regex.test(value);
        return res;
      })
      .withMessage(
        'Put some more chars. 1 lowercase, 1 capital, 1 number & 1 out of !@#$%^&* pleaaase'
      ),
    body('firstName').trim(),
    body('lastName').trim(),
    body('username').trim(),
  ];
};

// User Validation Error Handling
exports.userValidationErrorHandling = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const arrErrors = errors.array();
  const strValidationSummary = mergeErrors(arrErrors);

  next(customError(strValidationSummary, 422));
};

// frontend needs errors as string
// => so let's merge them togetherrrrr
const mergeErrors = (arrErrors) => {
  return arrErrors.map((error) => `${error.param}: ${error.msg}`).join('. ');
};
