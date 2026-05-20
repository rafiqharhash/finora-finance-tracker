'use strict';

const { validationResult } = require('express-validator');

/**
 * Middleware that reads express-validator results and returns a 400 response
 * with structured field errors if any validation rule failed.
 */
const validate = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

module.exports = validate;
