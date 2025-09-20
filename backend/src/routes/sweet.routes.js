const express = require("express");
const {addSweet,getAllSweets,updateSweet,searchSweets} = require("../controllers/sweet.controller");
const router = express.Router();

router.post("/", addSweet);
router.get("/", getAllSweets);
router.put("/:id", updateSweet);
router.get("/search", searchSweets);
module.exports = router;
