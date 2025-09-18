import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config(); // Configure environment variables
const PORT = process.env.PORT || 5000;


const app = express(); // Initialize Express app

app.use(cors()); // Enable CORS

app.use(express.json()); // Enable JSON parsing

app.get("/", (req, res) => {
  res.json({ message: "Sweet Shop Backend running 🚀" });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`); // Log the backend URL
});


