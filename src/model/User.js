const db = require("../config/connectDb");

const getUsers = (body) => {
  let sqlQuery = "SELECT * FROM users WHERE 1";
  const params = [];
  if (body.username) {
    sqlQuery += " AND username = ?";
    params.push(body.username);
  }
  const data = db.execute(sqlQuery, params);
  return data;
};

module.exports = {
  getUsers,
};
