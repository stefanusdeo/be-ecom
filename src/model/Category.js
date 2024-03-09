const db = require("../config/connectDb");

// get Categories
const getCategories = (body) => {
  let sqlQuery = "SELECT * FROM categories WHERE 1";
  const params = [];

  if (body.uuid) {
    sqlQuery += " AND uuid = ?";
    params.push(body.uuid);
  }

  if (body.name) {
    sqlQuery += " AND name = ?";
    params.push(body.name);
  }

  const data = db.execute(sqlQuery, params);
  return data;
};

const insertCategories = (body) => {
  const { name, uuid, currentDate } = body;

  // Query untuk menyimpan data kategori baru
  const query =
    "INSERT INTO categories (uuid, name, created_at, updated_at) VALUES (?, ?, ?, ?)";
  const values = [uuid, name, currentDate, currentDate];

  return db.execute(query, values);
};

const updateCategories = (body) => {
  const { uuid, name } = body;

  // Waktu sekarang
  const updatedDate = new Date().toISOString().slice(0, 19).replace("T", " ");

  // Query untuk menyimpan data kategori baru
  const query = `UPDATE categories SET name='${name}', updated_at='${updatedDate}' WHERE uuid='${uuid}'`;

  return db.execute(query);
};

const deleteCategories = async (uuid) => {
  const deleteQuery = "DELETE FROM categories WHERE uuid = ?";
  const result = await db.execute(deleteQuery, [uuid]);
  return result;
};

module.exports = {
  getCategories,
  insertCategories,
  updateCategories,
  deleteCategories,
};
