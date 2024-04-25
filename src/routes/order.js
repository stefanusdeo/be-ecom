const express = require("express");

const auth = require("../middleware/auth");
const rateLimit = require("../middleware/rateLimit");

const route = express.Router();

// controller
const {
  getOrders,
  insertOrder,
  getOrder,
  sendOrder,
} = require("../controller/orderController");

route.post("/", rateLimit, insertOrder);

route.get("/", auth, getOrders);
route.get("/by-uuid", auth, getOrder);
route.post("/send-order", auth, sendOrder);

module.exports = route;
