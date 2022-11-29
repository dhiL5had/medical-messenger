const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/auth.patient');
const {
  getDoctorsList,
  createAppointment,
  getAppointment,
  updateAppointment
} = require('../controllers/patient');

router.get("/doctors", checkAuth, getDoctorsList);

router.get("/appointments", checkAuth, getAppointment);

router.post("/appointments", checkAuth, createAppointment);

router.patch("/appointments", checkAuth, updateAppointment);

module.exports = router;