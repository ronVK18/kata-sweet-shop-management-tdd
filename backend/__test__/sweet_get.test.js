const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/index");
const Sweet = require("../src/models/sweet.model");

const JWT_SECRET = process.env.JWT_SECRET || "secret";

describe("Sweet API - Get All Sweets (Protected)", () => {
  let token;

  beforeAll(async() => {
    // Generate a valid token
    token = jwt.sign({ id: "123", username: "testuser" }, JWT_SECRET, {
      expiresIn: "1h",
    });
    await Sweet.deleteMany();
  });

  afterEach(async () => {
    await Sweet.deleteMany(); // clean DB between tests
  });

  it("should return an empty array when no sweets exist", async () => {
    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.sweets).toEqual([]);
  });

  it("should return all sweets when they exist", async () => {
    // Insert dummy sweets
    await Sweet.insertMany([
      { name: "Gulab Jamun", category: "Dessert", price: 20, quantityInStock: 50 },
      { name: "Barfi", category: "Dessert", price: 15, quantityInStock: 30 },
    ]);

    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.sweets.length).toBe(2);
    expect(res.body.sweets[0]).toHaveProperty("name", "Gulab Jamun");
    expect(res.body.sweets[1]).toHaveProperty("name", "Barfi");
  });
});
