const mysql = require("mysql2");

const connection = mysql.createPool({
  connectionLimit: 10,
  host: process.env.NODE_HOST,
  user: process.env.NODE_DATABASE_USERNAME,
  port: process.env.NODE_DATABASE_PORT,
  database: process.env.NODE_DATABASE,
});

module.exports = connection.promise();
