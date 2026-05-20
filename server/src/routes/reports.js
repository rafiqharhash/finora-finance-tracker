'use strict';

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getMonthlySummary,
  getCategoryBreakdown,
  getYearlySummary,
  getInsights,
} = require('../controllers/reportController');

// All routes require authentication
router.use(protect);

router.get('/monthly', getMonthlySummary);
router.get('/categories', getCategoryBreakdown);
router.get('/yearly', getYearlySummary);
router.get('/insights', getInsights);

module.exports = router;
