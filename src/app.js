const express = require("express");
const app = express();
const Restaurant = require("../models/index");
const db = require("../db/connection");

//TODO: Create your GET Request Route Below:
app.get("/restaurants", async (req, res) => {
  const restaurants = await Restaurant.findAll();
  res.json(restaurants);
});

app.get("/restaurants/:id", async (request, response) => {
  const restaurantId = request.params.id;
  const restaurants = await Restaurant.findByPk(restaurantId);
  response.json(restaurants);
});

app.use(express.json);
app.use(express.urlencoded);

app.post("/restaurants", async (request, response) => {
  const newRestaurant = await Restaurant.create(request.body);
});

app.put("/restaurants/:id", async (request, response) => {
  const restaurantId = request.params.id;
  let restaurant = await Restaurant.findByPk(restaurantId);
  restaurant = await restaurant.update(request.body);
});
module.exports = app;
