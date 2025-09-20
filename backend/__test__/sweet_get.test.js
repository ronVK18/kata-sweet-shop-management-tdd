const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/index"); // make sure this exports your express app
const Sweet = require("../src/models/sweet.model");

const JWT_SECRET = process.env.JWT_SECRET || "secret";

describe("Sweet API - Get All Sweets (Protected)", () => {
  let token;

  beforeAll(async () => {
    // Generate a valid token
    token = jwt.sign({ id: "123", username: "testuser" }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Clear sweets before tests
    await Sweet.deleteMany({});
  });

  afterEach(async () => {
    // Ensure DB is clean between tests
    await Sweet.deleteMany({});
  });

  it("should return an empty array when no sweets exist", async () => {
    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.sweets).toEqual([]);
  });

  it("should return all sweets when they exist", async () => {
    // Insert unique dummy sweets with different timestamps to avoid duplicates
    const sweetsData = [
      { name: `Gulab Jamun ${Date.now()}`, category: "Dessert", price: 20, quantityInStock: 50 },
      { name: `Barfi ${Date.now() + 1}`, category: "Dessert", price: 15, quantityInStock: 30 },
    ];
    await Sweet.insertMany(sweetsData);

    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.sweets.length).toBe(2);
    expect(res.body.sweets[0]).toHaveProperty("name", sweetsData[0].name);
    expect(res.body.sweets[1]).toHaveProperty("name", sweetsData[1].name);
  });
});
