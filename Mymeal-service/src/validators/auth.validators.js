const {body} = require ("express-validator");

const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(=?.{8,32})/

const registerValidator = [
    body('username')
    .notEmpty().withMessage("Username is required")
    .isLength({min: 4, max: 32}).withMessage("Username format incorrect"),
    body('email')
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email format incorrect"),
    body('password')
    .notEmpty().withMessage("Password is required")
  .matches(passwordRegexp).withMessage("Password format incorrect"),
  body('tags')
  .notEmpty().withMessage("Tags is required")
  .isArray().withMessage("must be an arra")
];

module.exports = {registerValidator};