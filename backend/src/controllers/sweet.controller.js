const Sweet = require("../models/sweet.model");

const addSweet = async (req, res) => {
  const { name, category, price, quantityInStock } = req.body;
   // Validation
    if (!name || !category || price == null || quantityInStock == null) {
      return res.status(400).json({ error: "All fields are required" });
    }
  // check for negative values
  if (price < 0) {
    return res.status(400).json({ error: "Price must be positive" });
  }
  if (quantityInStock < 0) {
    return res.status(400).json({ error: "Quantity in stock cannot be negative" });
  }

  try {
    const sweet = await Sweet.create({
      name,
      category,
      price,
      quantityInStock,
    });

    res.status(201).json({
      message: "Sweet added successfully",
      sweet,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "Sweet with this name already exists" });
    }
    if (error.errors) {
      // mongoose validation errors
      return res
        .status(400)
        .json({ error: Object.values(error.errors)[0].message });
    }
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
const getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.status(200).json({ sweets });
  } catch (error) {
    console.error("Error fetching sweets:", error);
    res.status(500).json({ error: "Server error" });
  }
};
module.exports = { addSweet, getAllSweets };
