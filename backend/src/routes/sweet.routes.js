const express = require("express");
const {addSweet} = require("../controllers/sweet.controller");
const router = express.Router();

router.post("/", addSweet);

module.exports = router;
