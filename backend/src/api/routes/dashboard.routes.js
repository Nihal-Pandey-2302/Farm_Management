const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboard.controller');

// Route for the Regulatory Officer's main dashboard view
router.get('/risk-monitor', DashboardController.getRiskMonitorData);
// Add this new line
router.get('/treatment-logs', DashboardController.getTreatmentLogs);
module.exports = router;