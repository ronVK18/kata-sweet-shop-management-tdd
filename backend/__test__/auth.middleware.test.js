const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/index"); // your Express app
const Sweet = require("../src/models/sweet.model");

const JWT_SECRET = process.env.JWT_SECRET || "secret";

describe("Auth Middleware - Protected Route", () => {
  let token;

  beforeAll(() => {
    // Generate a valid test token
    token = jwt.sign({ id: "123", username: "testuser" }, JWT_SECRET, { expiresIn: "1h" });
  });

  afterEach(async () => {
    await Sweet.deleteMany(); // clean DB between tests
  });

  it("should allow access with valid token", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Rasgulla",
        category: "Dessert",
        price: 30,
        quantityInStock: 20,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.sweet).toHaveProperty("name", "Rasgulla");
  });

  it("should block access with no token", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .send({
        name: "Kaju Katli",
        category: "Dessert",
        price: 50,
        quantityInStock: 15,
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "No token provided");
  });

  it("should block access with invalid token", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", "Bearer invalidtoken")
      .send({
        name: "Peda",
        category: "Dessert",
        price: 25,
        quantityInStock: 10,
      });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Invalid or expired token");
  });
});
