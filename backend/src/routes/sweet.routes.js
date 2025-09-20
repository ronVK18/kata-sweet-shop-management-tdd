const express = require("express");
const {addSweet,getAllSweets,updateSweet} = require("../controllers/sweet.controller");
const router = express.Router();

router.post("/", addSweet);
router.get("/", getAllSweets);
router.put("/:id", updateSweet);
router.get("/search", updateSweet);
module.exports = router;
