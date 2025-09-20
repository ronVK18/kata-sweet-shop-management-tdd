const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/index");
const Sweet = require("../src/models/sweet.model");

const JWT_SECRET = process.env.JWT_SECRET || "secret";

describe("Sweet API - Purchase Sweet", () => {
  let token;
  let sweet;

  beforeAll(() => {
    token = jwt.sign({ id: "123", username: "testuser" }, JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  beforeEach(async () => {
    await Sweet.deleteMany();
    sweet = await Sweet.create({
      name: "Kaju Katli",
      category: "Dessert",
      price: 50,
      quantityInStock: 10,
    });
  });

  it("should purchase sweet successfully when enough stock exists", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Purchase successful");
    expect(res.body.sweet.quantityInStock).toBe(5); // 10 - 5
  });
  
  it("should fail when purchasing more than stock", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 15 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Not enough stock available");
  });

  it("should fail when quantity is missing or invalid", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/purchase`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: -3 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Quantity must be greater than 0");
  });

  it("should return 404 when sweet does not exist", async () => {
    const res = await request(app)
      .post(`/api/sweets/507f1f77bcf86cd799439011/purchase`) // random ObjectId
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 2 });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Sweet not found");
  });



  
});
