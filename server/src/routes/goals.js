'use strict';

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  addContribution,
} = require('../controllers/goalController');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getGoals)
  .post(createGoal);

router.route('/:id')
  .put(updateGoal)
  .delete(deleteGoal);

router.post('/:id/contribute', addContribution);

module.exports = router;
