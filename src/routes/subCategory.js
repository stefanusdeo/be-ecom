const express = require("express");

const auth = require("../middleware/auth");

const route = express.Router();

// controller
const {
  getSubCategory,
  insertSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controller/subcategoryController");

route.post("/", auth, insertSubCategory);

route.get("/", getSubCategory);

route.put("/", auth, updateSubCategory);

route.delete("/", auth, deleteSubCategory);

module.exports = route;
