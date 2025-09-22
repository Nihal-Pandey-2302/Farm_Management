const express = require('express');
const router = express.Router();
const dashboardRoutes = require('./dashboard.routes'); 
// Import individual routers
const adminRoutes = require('./admin.routes');
const treatmentRoutes = require('./treatments.routes');
router.use('/dashboard', dashboardRoutes);
// Add other routes like users.routes.js, farms.routes.js here in the future

// Mount the individual routers
router.use('/admin', adminRoutes);
router.use('/treatments', treatmentRoutes);

module.exports = router;