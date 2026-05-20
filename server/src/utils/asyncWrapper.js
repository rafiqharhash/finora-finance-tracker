'use strict';

/**
 * Wraps an async route handler so that any rejected promise or thrown error
 * is forwarded to Express's next() error handler without try/catch boilerplate.
 *
 * @param {Function} fn - Async Express route handler (req, res, next)
 * @returns {Function} Express-compatible middleware
 */
const asyncWrapper = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncWrapper;
