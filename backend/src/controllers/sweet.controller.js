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
    return res
      .status(400)
      .json({ error: "Quantity in stock cannot be negative" });
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
const updateSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, quantityInStock } = req.body;
    // price validation
    if (price !== undefined && price < 0) {
      return res.status(400).json({ error: "Price must be positive" });
    }
    // stock validation
    if (quantityInStock !== undefined && quantityInStock < 0) {
      return res
        .status(400)
        .json({ error: "Quantity in stock cannot be negative" });
    }
    const sweet = await Sweet.findByIdAndUpdate(
      id,
      { name, category, price, quantityInStock },
      { new: true }
    );
    // check if sweet exists
    if (!sweet) {
      return res.status(404).json({ error: "Sweet not found" });
    }
    return res.status(200).json({ sweet });
  } catch (error) {
    console.error("Error updating sweet:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Search sweets by name, category, or price range
const searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const filter = {};

    if (name) {
      // case-insensitive search
      filter.name = { $regex: name, $options: "i" };
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(filter);
    res.status(200).json({ sweets });
  } catch (error) {
    console.error("Error searching sweets:", error);
    res.status(500).json({ error: "Server error" });
  }
};
const purchaseSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const {quantity} = req.body; 
    // quantity validation
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be greater than 0" });
    }

    const sweet = await Sweet.findById(id);
    // check if sweet exists
    if (!sweet) {
      return res.status(404).json({ error: "Sweet not found" });
    }
    // stock validation
    if (sweet.quantityInStock < quantity) {
      return res.status(400).json({ error: "Not enough stock available" });
    }

    sweet.quantityInStock -= quantity;
    await sweet.save();

    return res.status(200).json({ message: "Purchase successful", sweet });
  } catch (error) {
    console.error("Error purchasing sweet:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
const deleteSweet=async (req, res) => {
    // Auth check
    if (!req.user) {
      return res.status(401).json({ error: "No token provided" });
    }
    // Role check
    if (!req.user.role || req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access only" });
    }
    try {
      const { id } = req.params;
      const sweet = await Sweet.findByIdAndDelete(id);
      if (!sweet) {
        return res.status(404).json({ error: "Sweet not found" });
      }
      return res.status(200).json({ message: "Sweet deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  }
  module.exports = {
    addSweet,
    getAllSweets,
    updateSweet,
    searchSweets,
  purchaseSweet,
  deleteSweet,
};
