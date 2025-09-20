const request = require("supertest");
const app = require("../src/index");
const Sweet = require("../src/models/sweet.model");

describe("Sweet API - Add Sweet", () => {
  afterEach(async () => {
    await Sweet.deleteMany(); // clean DB between tests
  });

  it("should add a new sweet with valid details", async () => {
    const res = await request(app).post("/api/sweets").send({
      name: "Gulab Jamun",
      category: "Dessert",
      price: 20,
      quantityInStock: 50,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.sweet).toHaveProperty("name", "Gulab Jamun");
    expect(res.body.sweet).toHaveProperty("category", "Dessert");
    expect(res.body.sweet).toHaveProperty("price", 20);
    expect(res.body.sweet).toHaveProperty("quantityInStock", 50);
  });
  it("should fail when price is negative", async () => {
    const res = await request(app).post("/api/sweets").send({
      name: "Barfi",
      category: "Milk Sweet",
      price: -10,
      quantityInStock: 10,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Price must be positive");
  });
  it("should fail when quantityInStock is negative", async () => {
    const res = await request(app).post("/api/sweets").send({
      name: "Ladoo",
      category: "Traditional Sweet",
      price: 15,
      quantityInStock: -5,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "Quantity in stock cannot be negative"
    );
  });
  it("should fail when required fields are missing", async () => {
    const res = await request(app).post("/api/sweets").send({
      name: "Rasgulla",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "All fields are required");
  });
});
