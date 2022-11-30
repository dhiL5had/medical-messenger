const ObjectId = require('mongoose').Types.ObjectId;
const Room = require('../models/chatroom');
const Message = require('../models/message');
const { default: mongoose } = require('mongoose');

exports.getChatInfo = async(req, res, next) => {
  const { roomId } = req.params;
  const { userId } = req.userData;

  const promises = await Room.find({ $or: [
    { doctorId: ObjectId(userId) },{ patientId: ObjectId(userId) }
  ], $and: [{_id: ObjectId(roomId)}]});
  const isParticipant = await Promise.all(promises);
  if(!isParticipant) {
    return res.status(400).json({
      message: "Invalid request"
    });
  }

  Message.find({roomId: ObjectId(roomId)},{message:1, senderId:1,createdAt:1}).then((messages) => {
    res.status(200).json({message: "chat room", chatInfo: messages})
  }).catch(err => {
    console.log(err);
    res.status(500).json({message: "Invalid request"});
  })
}

exports.saveMessage = (req, res, next) => {
  const { message, roomId, userId } = req.user;
  const newMessage = new Message({
    message,
    roomId,
    senderId: userId
  });

  newMessage.save().then(result => {
    next();
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      message: "Unexpected Error Happened"
    });
    // next();
  });
}