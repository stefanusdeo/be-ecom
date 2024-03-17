const express = require("express");
const helmet = require("helmet");
var fs = require("file-system");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

// route
const authRoute = require("./src/routes/auth");
const categoryRoute = require("./src/routes/category");
const subCategoryRoute = require("./src/routes/subCategory");
const productRoute = require("./src/routes/product");
const orderRoute = require("./src/routes/order");
const aboutUsRoute = require("./src/routes/aboutus");
const baselayerRoute = require("./src/routes/baselayers");
const productImgRoute = require("./src/routes/productImg");
const bannerRoute = require("./src/routes/banners");
const emailRouter = require("./src/routes/email");
const termConditionRoute = require("./src/routes/termConditions");

// middleware
const error = require("./src/middleware/error");

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json());
app.use(cors());
app.use(helmet());

// var accessLogStream = fs.createWriteStream("./access.log", { flags: "a" });

// setup the logger
// app.use(
//   morgan("common", {
//     stream: accessLogStream,
//     skip: function (req, res) {
//       return res.statusCode === 200;
//     },
//   })
// );

app.get("/", (req, res) => {
  return res.send("Hiiii!!!, v1.19");
});
app.use("/images", express.static("uploads/"));
app.use("/api/login", authRoute);
app.use("/api/category", categoryRoute);
app.use("/api/sub-category", subCategoryRoute);
app.use("/api/about-us", aboutUsRoute);
app.use("/api/terms-conditions", termConditionRoute);
app.use("/api/product", productRoute);
app.use("/api/product-img", productImgRoute);
app.use("/api/order", orderRoute);
app.use("/api/baselayer", baselayerRoute);
app.use("/api/banners", bannerRoute);
app.use("/api/email", emailRouter);

app.use(error);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Running PORT:${PORT}`);
});
