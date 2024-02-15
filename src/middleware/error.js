module.exports = function (err, req, res, next) {
  console.error(err);
  return res.status(500).send("Server Error");
};
