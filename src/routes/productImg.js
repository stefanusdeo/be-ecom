const express = require("express");

const auth = require("../middleware/auth");

const route = express.Router();

// controller
const {
  getProductImg,
  deleteProductImg,
  insertProductImg,
  updateProductImg,
} = require("../controller/productImgController");

route.get("/", getProductImg);

route.post("/", auth, insertProductImg);
route.put("/", auth, updateProductImg);
route.delete("/", auth, deleteProductImg);

module.exports = route;
