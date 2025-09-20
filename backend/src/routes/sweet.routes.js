const express = require("express");
const {addSweet,getAllSweets,updateSweet,searchSweets,purchaseSweet,deleteSweet,restockSweet} = require("../controllers/sweet.controller");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", addSweet);
router.get("/", getAllSweets);
router.put("/:id", updateSweet);
router.get("/search", searchSweets);
router.get("/:id/purchase", purchaseSweet);
router.delete("/:id", deleteSweet);
router.post("/:id/restock", restockSweet);
module.exports = router;
