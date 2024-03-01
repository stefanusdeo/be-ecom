const express = require("express");

const auth = require("../middleware/auth");

const route = express.Router();

// controller
const {
  getBaseLayers,
  deleteBaseLayer,
  insertBaseLayers,
  updateBaseLayer,
} = require("../controller/baseLayerController");

route.get("/", getBaseLayers);

route.post("/", auth, insertBaseLayers);
route.put("/", auth, updateBaseLayer);
route.delete("/", auth, deleteBaseLayer);

module.exports = route;
