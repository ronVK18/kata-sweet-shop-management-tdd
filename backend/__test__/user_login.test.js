const request = require("supertest");
const app = require("../src/index");
const User = require("../src/models/user.model");

describe("Auth API - Login", () => {
  beforeAll(async () => {
    // Create a user in DB for login
    await User.deleteMany(); // clean DB
    await User.create({
      name: "Login Test",
      email: "login@example.com",
      password: "123456", // password will be hashed by model pre-save hook
    });
  });

  it("should login an existing user with valid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email", "login@example.com");
  });

  // ❌ 2. Wrong password
  it("should return 401 if password is incorrect", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Invalid email or password");
  });

   // ❌ 3. Non-existent user
  it("should return 401 if user does not exist", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nouser@example.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Invalid email or password");
  });
});
