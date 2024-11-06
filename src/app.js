const express = require("express");
const app = express();
const restaurantRouter = require("../routes/restaurant.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/restaurants", restaurantRouter);
module.exports = app;
