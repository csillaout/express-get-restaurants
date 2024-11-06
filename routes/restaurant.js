//routes
const express = require("express");
const router = express.Router();
const Restaurant = require("../models/index");

//get all restaurants
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({});
    res.json(restaurants);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching restaurants" });
  }
});

//get a restaurant by ID
router.get("/:id", async (req, res) => {
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
router.post("/", async (req, res) => {
  try {
    const newRestaurant = await Restaurant.create(req.body);
    res.status(201).json(newRestaurant);
  } catch (error) {
    res
      .status(400)
      .json({ error: "An error occurred while creating the restaurant." });
  }
});

//update a restaurant by ID
router.put("/:id", async (req, res) => {
  try {
    const [updated] = await Restaurant.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedRestaurant = await Restaurant.findByPk(req.params.id);
      res.json(updatedRestaurant);
    } else {
      res.status(404).json({ error: "Restaurant not found." });
    }
  } catch (error) {
    res
      .status(400)
      .json({ error: "An error occurred while updating the restaurant." });
  }
});

// Delete a restaurant by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Restaurant.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.json({ message: "Restaurant deleted successfully." });
    } else {
      res.status(404).json({ error: "Restaurant not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting the restaurant." });
  }
});

module.exports = router