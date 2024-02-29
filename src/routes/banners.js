const express = require("express");

const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const route = express.Router();

// controller
const { get, insert, destroy } = require("../controller/bannersController");

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

route.post("/", auth, upload.single("image"), insert);

route.get("/", get);

// route.put("/", auth, updateSubCategory);

route.delete("/", auth, destroy);

module.exports = route;
