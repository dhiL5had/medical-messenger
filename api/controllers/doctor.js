const argon = require('argon2');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/user');
const Appointment = require('../models/appointment');
const { default: mongoose } = require('mongoose');

exports.getPatientsList = (req, res, next) => {
  Appointment.aggregate([
    { $match: { doctorId: ObjectId(req.userData.userId) }},
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
  ]).then(patients => {
    const uniqueIds = new Set();
    let filteredPatients = [];
    patients.map(patient => {
      const isDuplicate = uniqueIds.has(patient.patientId.toString().replace(/ObjectId\("(.*)"\)/, "$1"));
      if(!isDuplicate) {
        uniqueIds.add(patient.patientId.toString().replace(/ObjectId\("(.*)"\)/, "$1"));
        filteredPatients.push(patient)
        return;
      }
      return;
    });
    console.log(filteredPatients);
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