const express = require('express');
const router = express.Router();
const TreatmentController = require('../controllers/treatment.controller');

// Route for a Vet to create a new prescription
router.post('/prescribe', TreatmentController.createPrescription);

// Route for a Farmer to confirm a treatment administration
router.post('/confirm', TreatmentController.confirmTreatment);

module.exports = router;