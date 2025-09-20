const express = require("express");
const {addSweet,getAllSweets,updateSweet,searchSweets,purchaseSweet,deleteSweet} = require("../controllers/sweet.controller");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", addSweet);
router.get("/", getAllSweets);
router.put("/:id", updateSweet);
router.get("/search", searchSweets);
router.get("/:id/purchase", purchaseSweet);
// Delete sweet (admin only)
router.delete("/:id", deleteSweet);
module.exports = router;
