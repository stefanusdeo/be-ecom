const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

// route
const authRoute = require("./src/routes/auth");
const categoryRoute = require("./src/routes/category");

// middleware
const error = require("./src/middleware/error");

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));
app.get("/", (req, res) => {
  return res.send("Hiiii!!!");
});

app.use("/api/login", authRoute);
app.use("/api/category", categoryRoute);

app.use(error);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Running PORT:${PORT}`);
});
