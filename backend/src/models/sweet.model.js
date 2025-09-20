const mongoose = require("mongoose");

const sweetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sweet name is required"],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },
    quantityInStock: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity must be 0 or greater"],
    },
  },
  { timestamps: true }
);

const Sweet = mongoose.model("Sweet", sweetSchema);

module.exports = Sweet;
