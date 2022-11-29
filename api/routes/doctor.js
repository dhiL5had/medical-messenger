const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/auth.doctor');
const { 
  getPatientsList, 
  pinPatient
 } = require('../controllers/doctor');

router.get("/patients", checkAuth, getPatientsList);
router.get("/pinpatient/:patientId", checkAuth, pinPatient);

module.exports = router;