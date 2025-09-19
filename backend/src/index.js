const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config(); // Configure environment variables
const PORT = process.env.PORT || 5000;


const app = express(); // Initialize Express app

app.use(cors()); // Enable CORS

app.use(express.json()); // Enable JSON parsing

app.post("/api/auth/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Fake token for now (replace with real JWT later)
  const token = "fake-jwt-token";
  res.status(201).json({ token });
});


app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`); // Log the backend URL
});

module.exports=app;


