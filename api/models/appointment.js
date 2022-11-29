const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const appointmentSchema = mongoose.Schema({
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
})

appointmentSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Appointment", appointmentSchema);