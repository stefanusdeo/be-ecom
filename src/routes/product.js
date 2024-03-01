const express = require("express");

const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const route = express.Router();

// controller
const {
  getProducts,
  getProductUuid,
  insertProduct,
  deleteProduct,
  updateProduct,
} = require("../controller/productController");

// Konfigurasi multer untuk unggah gambar

route.get("/", getProducts);
route.post("/", auth, insertProduct);
route.put("/", auth, updateProduct);
route.get("/:uuid", getProductUuid);
route.delete("/", deleteProduct);

module.exports = route;
