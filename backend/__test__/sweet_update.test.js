const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/index");
const Sweet = require("../src/models/sweet.model");

const JWT_SECRET = process.env.JWT_SECRET || "secret";

describe("Sweet API - Update Sweet (Basic)", () => {
  let token;

  beforeAll(() => {
    // generate a valid JWT for testing
    token = jwt.sign({ id: "123", username: "testuser" }, JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  afterEach(async () => {
    await Sweet.deleteMany();
  });

  it("should update a sweet successfully with valid details", async () => {
    const sweet = await Sweet.create({
      name: "Jalebi",
      category: "Fried",
      price: 10,
      quantityInStock: 20,
    });

    const res = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Jalebi Special",
        category: "Fried Dessert",
        price: 15,
        quantityInStock: 25,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.sweet).toHaveProperty("name", "Jalebi Special");
    expect(res.body.sweet).toHaveProperty("price", 15);
    expect(res.body.sweet).toHaveProperty("quantityInStock", 25);
  });
  
  it("should return 404 if sweet does not exist", async () => {
    const fakeId = "64b7e2d62f1b146d7b8f1234"; // valid ObjectId-like string
    const res = await request(app)
      .put(`/api/sweets/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "NonExistent Sweet",
        category: "None",
        price: 10,
        quantityInStock: 5,
      });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Sweet not found");
  });

  it("should fail when updating with negative price", async () => {
    const sweet = await Sweet.create({
      name: "Barfi",
      category: "Milk Sweet",
      price: 25,
      quantityInStock: 10,
    });

    const res = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        price: -50,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Price must be positive");
  });

  it("should fail when updating with negative quantityInStock", async () => {
    const sweet = await Sweet.create({
      name: "Ladoo",
      category: "Traditional Sweet",
      price: 15,
      quantityInStock: 10,
    });

    const res = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantityInStock: -3,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Quantity in stock cannot be negative");
  });
});
