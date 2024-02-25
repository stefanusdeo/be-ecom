const express = require("express");

const auth = require("../middleware/auth");

const route = express.Router();

// controller
const {
  getOrders,
  insertOrder,
  updateStatusOrder,
} = require("../controller/orderController");

route.post("/", auth, insertOrder);

route.get("/", auth, getOrders);

route.put("/", auth, updateStatusOrder);

module.exports = route;
