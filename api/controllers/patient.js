const argon = require('argon2');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/user');
const Appointment = require('../models/appointment');

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

exports.getAppointment = (req, res, nex) => {
  Appointment.aggregate([
    {
      $match: { patientId: ObjectId(req.userData.userId) },
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
        doctor: "$Doctor.name"
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
        doctor: 1
      }
    }
  ]).then(data => {
    res.status(200).json({ 
      message: "Appointment List",
      appointments: data 
    });
  }).catch(err => {
    console.log(err);
    res.status(500).json({ message: "Invalid request"})
  })
}

exports.createAppointment = (req, res, nex) => {
  const { description, date, time, doctorId } = req.body;
  const appointment = new Appointment({
    description,
    date,
    time,
    doctorId,
    patientId: req.userData.userId
  });
  appointment.save().then(app => {
    res.status(201).json({
      message: "Appointment Created Successfully"
    })
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      message: "Appointment creation failed!",
    })
  })
};

exports.updateAppointment = (req, res, nex) => {
  Appointment.findOne({ patientId: req.params.userId }).then(data => {
    res.status(200).json({ data })
  });
};