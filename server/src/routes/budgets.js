'use strict';

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  checkAlerts,
} = require('../controllers/budgetController');

// All routes require authentication
router.use(protect);

// IMPORTANT: /alerts must come before /:id
router.get('/alerts', checkAlerts);

router.route('/')
  .get(getBudgets)
  .post(createBudget);

router.route('/:id')
  .put(updateBudget)
  .delete(deleteBudget);

module.exports = router;
