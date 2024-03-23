const express = require("express");

const auth = require("../middleware/auth");
const rateLimit = require("../middleware/rateLimit");

const route = express.Router();

// controller
const {
  getOrders,
  insertOrder,
  getOrder,
} = require("../controller/orderController");

route.post("/", rateLimit, insertOrder);

route.get("/", auth, getOrders);
route.get("/by-uuid", auth, getOrder);

module.exports = route;
