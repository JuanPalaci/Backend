const { validationResult } = require('express-validator');
const debug = require("debug")("MyMeal-api:validator");

const runValidation = (req, res, next) => {
    // Code goes here...
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        debug(errors);
        return res.status(400).json({
          errors: errors.array().map(item => item.msg)
        });
      }
      next();
  };

module.exports = { runValidation };