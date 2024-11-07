//routes
const express = require("express");
const restaurantRoute = express.Router();
const Restaurant = require("../models/index");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");

/** All of these chains perform the exact same operation on seperate variables
 *  check it's not empty -> trim it down
 *  They're seperated for readability
 */
const checkName = () => check("name").not().isEmpty().trim();
const checkLocation = () => check("location").not().isEmpty().trim();
const checkCuisine = () => check("cuisine").not().isEmpty().trim();

// This chain checks the length is more than 10 and less than 30
const checkNameLength = () => check("name").isByteLength({ min: 10, max: 30 });

//Get all restaurants
restaurantRoute.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({});
    res.json(restaurants);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching restaurants" });
  }
});

//Get a restaurant by ID
restaurantRoute.get("/restaurants/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ error: "Restaurant not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the restaurant." });
  }
});

//Create a new restaurant
restaurantRoute.post(
  "/restaurants",
  [checkName(), checkNameLength(), checkLocation(), checkCuisine()], // Validators
  async (req, res) => {
    // Validate the request body
    const error = validationResult(req);
    // If there are validation errors, return them
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    // Create a new restaurant if no errors are found
    const name = req.body.name;
    const location = req.body.location;
    const cuisine = req.body.cuisine;
    await Restaurant.create({ name, location, cuisine });
    const allRestaurants = await Restaurant.findAll();
    res.json(allRestaurants);
  }
);

// Update a restaurant by ID
restaurantRoute.put(
  "//restaurants/:id",
  [checkName(), checkNameLength(), checkLocation(), checkCuisine()], // Validators
  async (req, res) => {
    const errors = validationResult(req);

    // If there are validation errors, return them
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const name = req.body.name;
    const location = req.body.location;
    const cuisine = req.body.cuisine;
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (restaurant == null) {
      res.status(404).send({ error: "Restaurant not found" });
      return;
    }
    await restaurant.update({ name, location, cuisine });
    res.json(restaurant);
  }
);
// Delete a restaurant by ID
restaurantRoute.delete("/restaurants/:id", async (req, res) => {
  let restaurant = await Restaurant.findByPk(req.params.id);
  if (restaurant == null) {
    res.status(404).send({ error: "Restaurant not found" });
    return;
  }
  await restaurant.destroy();
  res.json({ message: "Deleted" });
});

module.exports = router;
