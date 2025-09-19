const request = require("supertest");
const app = require("../src/index");

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "123456" ,name :"Test User" });

    expect(res.statusCode).toBe(201); // Check if the status code is 201
    expect(res.body).toHaveProperty("token"); // Check if the response body has a token property
  });
});
