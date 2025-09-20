const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config(); // Configure environment variables
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
let sweets = []; // in memory storage
connectDB(); // Connect to the database
const app = express(); // Initialize Express app
app.use(cors()); // Enable CORS

app.use(express.json()); // Enable JSON parsing

app.use("/api/auth", authRoutes);
app.post("/api/sweets", (req, res) => {
  const { name, category, price, quantityInStock } = req.body;
  const sweet = {
    id: sweets.length + 1,
    name,
    category,
    price,
    quantityInStock,
  };

  sweets.push(sweet);

  res.status(201).json({ message: "Sweet added successfully", sweet });
});
// app.listen(PORT, () => {
//   console.log(`Backend running on http://localhost:${PORT}`); // Log the backend URL
// });

module.exports = app;
