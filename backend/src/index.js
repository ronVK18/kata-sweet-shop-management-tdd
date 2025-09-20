const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config(); // Configure environment variables
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const sweetsRoutes=require("./routes/sweet.routes");
const auth = require("./middleware/auth");
connectDB(); // Connect to the database
const app = express(); // Initialize Express app
app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON parsing

app.use("/api/auth", authRoutes);
app.use("/api/sweets",auth, sweetsRoutes);
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`); // Log the backend URL
});

module.exports = app;
