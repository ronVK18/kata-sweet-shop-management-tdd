const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/index");
const Sweet = require("../src/models/sweet.model");

const JWT_SECRET = process.env.JWT_SECRET || "secret";

describe("Sweet API - Search Sweets", () => {
  let token;

  beforeAll(() => {
    token = jwt.sign({ id: "123", username: "testuser" }, JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  beforeEach(async () => {
    await Sweet.deleteMany();
    await Sweet.insertMany([
      { name: "Gulab Jamun", category: "Dessert", price: 20, quantityInStock: 50 },
      { name: "Rasgulla", category: "Dessert", price: 15, quantityInStock: 30 },
      { name: "Ladoo", category: "Traditional", price: 10, quantityInStock: 40 },
    ]);
  });

  it("should search sweets by name", async () => {
    const res = await request(app)
      .get("/api/sweets/search?name=Rasgulla")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.sweets.length).toBe(1);
    expect(res.body.sweets[0]).toHaveProperty("name", "Rasgulla");
  });

  it("should search sweets by category", async () => {
    const res = await request(app)
      .get("/api/sweets/search?category=Dessert")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.sweets.length).toBe(2);
  });

  it("should search sweets by price range", async () => {
    const res = await request(app)
      .get("/api/sweets/search?minPrice=12&maxPrice=18")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.sweets.length).toBe(1);
    expect(res.body.sweets[0]).toHaveProperty("name", "Rasgulla");
  });
});
