const express = require("express");

const auth = require("../middleware/auth");
const rateLimit = require("../middleware/rateLimit");

const route = express.Router();

// controller
const { getOrders, insertOrder } = require("../controller/orderController");

route.post("/", rateLimit, insertOrder);

route.get("/", auth, getOrders);

module.exports = route;
