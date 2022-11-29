const argon = require('argon2');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/user');
const Appointment = require('../models/appointment');
const Room = require('../models/chatroom')
const { default: mongoose } = require('mongoose');

exports.getDoctorsList = (req, res, next) => {
  let fetchedDoctors;
  User.find({ role: 2 }).then(doctors => {
    fetchedDoctors = doctors.map(doc =>{
      return {
        id: doc._id,
        name: doc.name,
      }
    });
    res.status(200).json({
      message: "doctors list",
      doctors: fetchedDoctors
    })
  }).catch(err => {
    console.log(err);
    res.status(500).json({ message: "Invalid request"})
  })
}

exports.getAppointment = async(req, res, nex) => {
  const patientId = req.userData.userId
  let appointments = []
  try {
    const apps = await Appointment.aggregate([
      {
        $match: { patientId: ObjectId(patientId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "doctorId",
          foreignField: "_id",
          as: "Doctor"
        }
      },
      {
        $addFields: {
          doctor: "$Doctor.name",
          roomId: ''
        }
      },
      {
        $unwind: "$doctor"
      },
      {
        $project: {
          _id: 1,
          description:1 ,
          date: 1,
          time: 1,
          doctor: 1,
          doctorId: 1,
          roomId: 1
        }
      }
    ]);
    const promises = apps.map(async app => {
    const { _id, description, date, time, doctor, doctorId } = app;
    const room = await Room.findOne({doctorId: ObjectId(app.doctorId), patientId: ObjectId(patientId)});
    return {
        _id,
        description,
        date,
        time,
        doctor,
        doctorId,
        roomId: room._id
      }
    })
    const appoints = await Promise.all(promises);
    appointments = appoints
  } catch(err){
    console.log(err);
    res.status(500).json({ message: "Invalid request"})
  } finally {
    res.status(200).json({ 
      message: "Appointment List",
      appointments: appointments 
    });
  }
}

exports.createAppointment = async (req, res, nex) => {
  const { description, date, time, doctorId } = req.body;
  const patientId = req.userData.userId;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const appointment = new Appointment({
      description,
      date,
      time,
      doctorId,
      patientId
    });
    await appointment.save();

    const roomActive = await Room.find({
      doctorId,
      patientId
    })
    if (roomActive.length <= 0) {
      const chatroom = new Room({
        doctorId, 
        patientId
      });
      await chatroom.save();
    }
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: "Appointment creation failed!",
    })
  } finally {
    session.commitTransaction();
    session.endSession();
    res.status(201).json({
      message: "Appointment Created Successfully"
    })
  }
};

exports.updateAppointment = (req, res, nex) => {
  Appointment.findOne({ patientId: req.params.userId }).then(data => {
    res.status(200).json({ data })
  });
};