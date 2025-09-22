const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');

// Route for a Regulatory Officer to approve a new farm registration
router.post('/farms/approve', AdminController.approveFarm);

module.exports = router;