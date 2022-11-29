const argon = require('argon2');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/user');
const Appointment = require('../models/appointment');
const Room = require('../models/chatroom');
const { default: mongoose } = require('mongoose');

exports.getPatientsList = (req, res, next) => {
  const doctorId = req.userData.userId;
  Appointment.aggregate([
    { $match: { doctorId: ObjectId(doctorId) }},
    {
      $lookup: {
        from: "users",
        localField: "patientId",
        foreignField: "_id",
        as: "Patient"
      }
    },
    {
      $addFields: {
        patient: "$Patient.name",
        email: "$Patient.email",
        pinned: "$Patient.pinned",
      }
    },
    { $unwind: "$patient" },
    { $unwind: "$email" },
    { $unwind: "$pinned" },
    {
      $project: {
        _id: 0,
        patient: 1,
        email: 1,
        patientId: 1,
        pinned: 1
      }
    }
  ]).then(async patients => {
    let uniqueIds = [];
    let filteredPatients = [];
    const promises = patients.map(async patient => {
      const patientId = `${patient.patientId.toString()}`;
      const isDuplicate = uniqueIds.includes(patientId);
      if(isDuplicate) return;
      uniqueIds.push(patientId);
      const room = await Room.findOne({doctorId: ObjectId(doctorId), patientId: ObjectId(patient.patientId)});
      filteredPatients.push({...patient, roomId: room._id});
      return;
    });
    const ps = await Promise.all(promises);
    res.status(200).json({message: "patients list", patients:filteredPatients})
  }).catch(err => {
    console.log(err);
    res.status(500).json({message: "Invalid request"});
  })
}

exports.pinPatient = async (req, res, next) => {
  const patientId = req.params.patientId;
  const doctorId = req.userData.userId;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const patients = await Appointment.find({ doctorId: ObjectId(doctorId) });
    patients.map(async patient => {
      await User.updateMany({ _id: patient.patientId}, { pinned: false });
    })
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    res.status(500).json({message: "Pinning Failed"})
  } finally {
    await User.updateOne({ _id: patientId }, { pinned: true });
    session.commitTransaction();
    session.endSession();
    res.status(201).json({ message: "Patient pinned "});
  }
}