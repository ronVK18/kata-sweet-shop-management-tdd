const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");
const Sweet = require("../src/models/sweet.model");
const jwt = require("jsonwebtoken");

describe("Sweet API - Delete Sweet (Admin Only)", () => {
  let adminToken;
  let userToken;
  let sweet;

  beforeAll(async () => {
    // Create an admin
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    });
    adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || "secret");

    // Create a normal user
    const user = await User.create({
      name: "Normal User",
      email: "user@example.com",
      password: "123456",
      role: "user",
    });
    userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret");

    // Create a sweet to delete
    sweet = await Sweet.create({
      name: "Ladoo",
      category: "Dessert",
      price: 10,
      quantityInStock: 100,
    });
  });

  afterAll(async () => {
    await User.deleteMany();
    await Sweet.deleteMany();
  });

  // ❌ 1. No token
  it("should return 401 if no token is provided", async () => {
    const res = await request(app).delete(`/api/sweets/${sweet._id}`);
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "No token provided");
  });

  // ❌ 2. Non-admin user
  it("should return 403 if a normal user tries to delete a sweet", async () => {
    const res = await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Admin access only");
  });

  // ✅ 3. Admin deletes sweet successfully
  it("should allow admin to delete a sweet", async () => {
    const res = await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Sweet deleted successfully");
  });

  // ❌ 4. Admin tries to delete non-existent sweet
  it("should return 404 if sweet does not exist", async () => {
    const fakeId = "64b6f2f6f0c3d2a5b5c12345"; // dummy ObjectId
    const res = await request(app)
      .delete(`/api/sweets/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Sweet not found");
  });
});
