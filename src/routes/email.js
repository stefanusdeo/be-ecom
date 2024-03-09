const express = require("express");

const auth = require("../middleware/auth");
const rateLimit = require("../middleware/rateLimit");

const route = express.Router();

// controller
const { getEmail, createEmail } = require("../controller/emailController");

route.post("/", rateLimit, createEmail);

route.get("/", auth, getEmail);

module.exports = route;
