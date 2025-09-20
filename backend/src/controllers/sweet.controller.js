const Sweet = require("../models/sweet.model");

const addSweet = async (req, res) => {
  const { name, category, price, quantityInStock } = req.body;

  
  try {
    const sweet = await Sweet.create({ name, category, price, quantityInStock });

    res.status(201).json({
      message: "Sweet added successfully",
      sweet,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Sweet with this name already exists" });
    }
    if (error.errors) {
      // mongoose validation errors
      return res.status(400).json({ error: Object.values(error.errors)[0].message });
    }
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
module.exports = { addSweet };