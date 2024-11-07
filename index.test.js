const { test, describe, expect } = require("@jest/globals");
const Restaurant = require("./models/Restaurant");
const request = require("supertest");
const app = require("./src/app");
const db = require("./db/connection");

beforeAll(async () => {
  // Sync the database before running tests
  await db.sync({ force: true });
  // Seed initial restaurant data for testing
  await Restaurant.bulkCreate([
    { name: "Pizza Palace", location: "New York", cuisine: "Italian" },
    { name: "Sushi World", location: "Tokyo", cuisine: "Japanese" },
  ]);
});

afterAll(async () => {
  // Close the database connection after all tests
  await db.close();
});

describe("Restaurant API", () => {
  // Test GET /restaurants route for status code 200
  test("Verify GET /restaurants route returns status code 200", async () => {
    const response = await request(app).get("/restaurants");
    expect(response.statusCode).toBe(200);
  });

  // Test that GET /restaurants returns an array
  test("Verify GET /restaurants returns an array of restaurants", async () => {
    const response = await request(app).get("/restaurants");
    const parsed = JSON.parse(response.text);
    for (line of parsed) {
      expect(line).toHaveProperty("name");
      expect(line).toHaveProperty("cuisine");
      expect(line).toHaveProperty("location");
    }
  });

  // Test that GET /restaurants returns the correct number of restaurants
  test("Test GET /restaurants returns the correct number of restaurants", async () => {
    const response = await request(app).get("/restaurants");
    expect(response.body.length).toBe(2); // Adjust based on seeded data
  });

  // Test that GET /restaurants returns the correct restaurant data
  test("Test GET /restaurants returns the correct restaurant data", async () => {
    const response = await request(app).get("/restaurants");
    expect(response.body[0]).toMatchObject({
      name: "Pizza Palace",
      location: "New York",
      cuisine: "Italian",
    });
    expect(response.body[1]).toMatchObject({
      name: "Sushi World",
      location: "Tokyo",
      cuisine: "Japanese",
    });
  });

  // Verify that GET /restaurants/:id returns the correct data
  test("Verify GET /restaurants/:id returns the correct restaurant", async () => {
    const response = await request(app).get("/restaurants/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      name: "Pizza Palace",
      location: "New York",
      cuisine: "Italian",
    });
  });

  // Test that POST /restaurants adds a new restaurant
  test("Test POST /restaurants adds a new restaurant", async () => {
    const newRestaurant = {
      name: "Burger Hub",
      location: "Chicago",
      cuisine: "American",
    };
    const response = await request(app)
      .post("/restaurants")
      .send(newRestaurant);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(newRestaurant);

    // Verify the updated list
    const getAllResponse = await request(app).get("/restaurants");
    expect(getAllResponse.body.length).toBe(3);
  });

  // Verify that PUT /restaurants/:id updates the restaurant data
  test("Verify PUT /restaurants/:id updates the restaurant", async () => {
    const updatedData = {
      name: "Pizza Planet",
      location: "New York",
      cuisine: "Italian",
    };
    const response = await request(app).put("/restaurants/1").send(updatedData);
    expect(response.statusCode).toBe(200);
    expect(response.body[0]).toBe(1); // Should return number of affected rows

    // Verify the updated restaurant data
    const getResponse = await request(app).get("/restaurants/1");
    expect(getResponse.body).toMatchObject(updatedData);
  });

  // Test DELETE /restaurants/:id deletes the restaurant with the provided id
  test("Test DELETE /restaurants/:id deletes the restaurant", async () => {
    const response = await request(app).delete("/restaurants/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(1); // 1 indicates successful deletion

    // Verify the restaurant no longer exists
    const getResponse = await request(app).get("/restaurants/1");
    expect(getResponse.statusCode).toBe(404);
  });
});

//////////New testing for Validation
describe("Restaurant API - Validation Tests", () => {
  // Test that POST /restaurants returns error when "name" field is empty
  test("POST /restaurants returns error if name is empty", async () => {
    const response = await request(app).post("/restaurants").send({
      name: "",
      location: "New York",
      cuisine: "Italian",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual([
      {
        msg: "Name field cannot be empty or whitespace only",
        param: "name",
        location: "body",
      },
    ]);
  });

  // Test that POST /restaurants returns error when "location" field is empty
  test("POST /restaurants returns error if location is empty", async () => {
    const response = await request(app).post("/restaurants").send({
      name: "Burger King",
      location: "",
      cuisine: "American",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual([
      {
        msg: "Location field cannot be empty or whitespace only",
        param: "location",
        location: "body",
      },
    ]);
  });

  // Test that POST /restaurants returns error when "cuisine" field is empty
  test("POST /restaurants returns error if cuisine is empty", async () => {
    const response = await request(app).post("/restaurants").send({
      name: "Pasta Express",
      location: "Rome",
      cuisine: "",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual([
      {
        msg: "Cuisine field cannot be empty or whitespace only",
        param: "cuisine",
        location: "body",
      },
    ]);
  });

  // Test that POST /restaurants returns error if all fields are empty
  test("POST /restaurants returns error if all fields are empty", async () => {
    const response = await request(app).post("/restaurants").send({
      name: "",
      location: "",
      cuisine: "",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual([
      {
        msg: "Name field cannot be empty or whitespace only",
        param: "name",
        location: "body",
      },
      {
        msg: "Location field cannot be empty or whitespace only",
        param: "location",
        location: "body",
      },
      {
        msg: "Cuisine field cannot be empty or whitespace only",
        param: "cuisine",
        location: "body",
      },
    ]);
  });

  // Test that POST /restaurants returns error if name and location are empty
  test("POST /restaurants returns error if name and location are empty", async () => {
    const response = await request(app).post("/restaurants").send({
      name: "",
      location: "",
      cuisine: "Italian",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual([
      {
        msg: "Name field cannot be empty or whitespace only",
        param: "name",
        location: "body",
      },
      {
        msg: "Location field cannot be empty or whitespace only",
        param: "location",
        location: "body",
      },
    ]);
  });

  // Test that POST /restaurants returns error if name and cuisine are empty
  test("POST /restaurants returns error if name and cuisine are empty", async () => {
    const response = await request(app).post("/restaurants").send({
      name: "",
      location: "New York",
      cuisine: "",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual([
      {
        msg: "Name field cannot be empty or whitespace only",
        param: "name",
        location: "body",
      },
      {
        msg: "Cuisine field cannot be empty or whitespace only",
        param: "cuisine",
        location: "body",
      },
    ]);
  });
});
