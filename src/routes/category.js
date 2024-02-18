const express = require("express");

const auth = require("../middleware/auth");

const route = express.Router();

// controller
const {
  getCategories,
  insertCategories,
  updateCategories,
  deleteCategories,
} = require("../controller/categoriesController");

route.post("/", auth, insertCategories);

route.get("/", getCategories);

route.put("/", auth, updateCategories);

route.delete("/", auth, deleteCategories);

module.exports = route;
