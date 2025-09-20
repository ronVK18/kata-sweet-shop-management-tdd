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
});
