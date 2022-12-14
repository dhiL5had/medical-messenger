const express = require("express");
const app = express();
const path = require("path");
require('dotenv').config({ path: path.join(__dirname, '.env')});

const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const authRoute = require("./routes/auth");
const patientRoute = require("./routes/patient");
const doctorRoute = require("./routes/doctor");
var chatRoute = require("./routes/chat");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log("Connection failed");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/auth", authRoute);
app.use("/api/patient", patientRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/chat", chatRoute);


module.exports = app;
