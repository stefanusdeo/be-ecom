const express = require("express");

const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const route = express.Router();

// controller
const { get, insert, destroy, update} = require("../controller/bannersController");


route.post("/", auth, insert);

route.get("/", get);

route.put("/", auth, update);

route.delete("/", auth, destroy);

module.exports = route;
