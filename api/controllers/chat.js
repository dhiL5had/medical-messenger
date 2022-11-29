const argon = require('argon2');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/user');
const Appointment = require('../models/appointment');
const { default: mongoose } = require('mongoose');

exports.getChatRoom = (req, res, next) => {
  console.log(req.params.roomId);
  console.log(req.userData.userId);
  res.status(200).json({message: "chat room", RoomId: req.userData.userId})
}