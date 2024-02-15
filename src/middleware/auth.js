const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({
      message: "Access denied!!",
    });
  const KEY = process.env.KEY_TOKEN;

  try {
    const decoded = jwt.verify(token, KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Invalid Token",
    });
  }
};
