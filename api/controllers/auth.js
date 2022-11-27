const argon = require('argon2');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.createUser = (req, res, next) => {
  const { name, email, password, role } = req.body;
  argon.hash(password).then(hash => {
    const user = new User({
      name,
      email,
      role,
      password: hash,
    });
    user.save().then(result => {
      res.status(201).json({
        message: "user created successfully",
      });
    }).catch(err => {
      res.status(500).json({
        message: "Invalide authentication credentials!"
      });
    });
  });
};

exports.userLogin = (req, res, next) => {
  const { email, password } = req.body;
  let fetchedUser;
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    }
    fetchedUser = user;
    return argon.verify(user.password, password);
  })
  .then(result => {
    if (!result) {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    }
    const token = jwt.sign(
      { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({
      token,
      expiresIn: 3600,
      userId: fetchedUser._id,
      userRole: fetchedUser.role,
    });
  }).catch(err => {
    return res.status(401).json({
      message: "Invalid authentication credentials!"
    })
  })
};