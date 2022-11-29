const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const chatRoomSchema = mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  active: { type: Boolean, default: true}
})

chatRoomSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Room", chatRoomSchema);