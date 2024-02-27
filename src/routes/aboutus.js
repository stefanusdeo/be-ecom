const express = require("express");

const auth = require("../middleware/auth");

const route = express.Router();

// controller
const {
  getAboutUs,
  insertAboutUs,
  updateAboutUs,
  deleteAboutUs,
} = require("../controller/aboutUsController");

route.post("/", auth, insertAboutUs);

route.get("/", getAboutUs);

route.put("/", auth, updateAboutUs);

route.delete("/", auth, deleteAboutUs);

module.exports = route;
