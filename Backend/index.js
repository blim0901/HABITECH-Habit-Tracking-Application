/* eslint-disable */

'use strict';

const functions = require("firebase-functions");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

//const config = require("./config");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: true }));


const User = require("./routes/userRoutes")
const Calendar = require("./routes/calendarRoutes")
const Habit = require("./routes/habitRoutes")


app.use('/user', User)
app.use('/calendar', Calendar)
app.use('/habit', Habit)

exports.appMethods = functions.https.onRequest(app);