const express = require("express");

const route = express.Router();

// controller
const { login } = require("../controller/authController");

route.post("/", login);

module.exports = route;
