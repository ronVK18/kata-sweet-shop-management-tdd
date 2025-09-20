const express = require("express");
const {addSweet,getAllSweets} = require("../controllers/sweet.controller");
const router = express.Router();

router.post("/", addSweet);
router.get("/", getAllSweets);
module.exports = router;
