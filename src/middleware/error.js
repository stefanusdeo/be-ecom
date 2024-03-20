const multer = require("multer");

module.exports = function (err, req, res, next) {
  if (err instanceof multer.MulterError) {
    res.json({
      message: err.message,
    });
  }
  console.error(err);
  return res.status(500).json({ message: "Server Error" });
};
