const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");
const Sweet = require("../src/models/sweet.model");
const jwt = require("jsonwebtoken");

describe("Sweet API - Restock Sweet (Admin Only)", () => {
  let adminToken;
  let userToken;
  let sweet;

  beforeAll(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});

    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    });
    adminToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || "secret");

    const user = await User.create({
      name: "Normal User",
      email: "user@example.com",
      password: "123456",
      role: "user",
    });
    userToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "secret");

    sweet = await Sweet.create({
      name: "Barfi",
      category: "Dessert",
      price: 20,
      quantityInStock: 50,
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .send({ quantity: 10 });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "No token provided");
  });

  it("should return 403 if a normal user tries to restock", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 10 });
    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Admin access only");
  });

  it("should return 400 if quantity is not provided or invalid", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: -5 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should restock sweet for admin", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 20 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Sweet restocked successfully");
    expect(res.body.sweet.quantityInStock).toBe(70);
  });

  it("should return 404 if sweet does not exist", async () => {
    const fakeId = "64b6f2f6f0c3d2a5b5c12345";
    const res = await request(app)
      .post(`/api/sweets/${fakeId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 10 });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Sweet not found");
  });
});
