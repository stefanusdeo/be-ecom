const express = require("express");

const auth = require("../middleware/auth");

const route = express.Router();

// controller
const {
  getBaseLayers,
  deleteBaseLayer,
} = require("../controller/baseLayerController");

route.get("/", getBaseLayers);

route.delete("/", auth, deleteBaseLayer);

module.exports = route;
