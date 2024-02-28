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
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Direktori untuk menyimpan file yang diunggah
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

route.get("/", getProducts);
route.post("/", auth, upload.single("main_img"), insertProduct);
route.put("/", auth, upload.single("main_img"), updateProduct);
route.get("/:uuid", getProductUuid);
route.delete("/", deleteProduct);

module.exports = route;
