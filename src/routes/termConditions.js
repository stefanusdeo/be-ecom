const express = require("express");

const auth = require("../middleware/auth");

const route = express.Router();

// controller
const {
  get,
  insert,
  update,
  deleteData,
} = require("../controller/termConditionsController");

route.post("/", auth, insert);

route.get("/", get);

route.put("/", auth, update);

route.delete("/", auth, deleteData);

module.exports = route;
