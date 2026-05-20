'use strict';

const rateLimit = require('express-rate-limit');

/**
 * General limiter — 100 requests per 15 minutes per IP.
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests — please try again after 15 minutes',
  },
  skipSuccessfulRequests: false,
});

/**
 * Auth limiter — stricter: 10 requests per 15 minutes per IP.
 * Applied to login and register routes to mitigate brute-force attacks.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      'Too many authentication attempts — please try again after 15 minutes',
  },
  skipSuccessfulRequests: false,
});

module.exports = { generalLimiter, authLimiter };
