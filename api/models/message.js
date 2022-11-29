const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const messageSchema = mongoose.Schema({
  message: { type: String, required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true},
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  },
  {
    timestamps: true
  })

messageSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Message", messageSchema);