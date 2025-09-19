const request = require("supertest");
const app = require("../src/index");

describe("Auth Registration API", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test19@example.com",
      password: "123456",
      name: "Test User",
    });

    expect(res.statusCode).toBe(201); // Check if the status code is 201
    expect(res.body).toHaveProperty("token"); // Check if the response body has a token property
  });
  it("should return 400 if name is missing", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "123456",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "Name, email and password are required"
    );
  });

  it("should return 400 if email is missing", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      password: "123456",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "Name, email and password are required"
    );
  });
  it("should return 400 if password is missing", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      
      
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "Name, email and password are required"
    );
  });

  
});
