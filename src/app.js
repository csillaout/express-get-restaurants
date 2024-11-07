const express = require("express");
const app = express();
const restaurantRoute = require("../routes/restaurant.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", restaurantRoute);
module.exports = app;
