const db = require("../config/connectDb");
const createSlug = require("../config/createSlug");

// get Categories
const getBaseLayer = (body) => {
  let sqlQuery = "SELECT * FROM baselayers WHERE 1";
  const params = [];

  if (body.id) {
    sqlQuery += " AND id = ?";
    params.push(body.id);
  }

  if (body.status) {
    sqlQuery += " AND status = ?";
    params.push(body.status);
  }

  if (body.id_product) {
    sqlQuery += " AND id_product = ?";
    params.push(body.id_product);
  }

  const data = db.execute(sqlQuery, params);
  return data;
};

const insertBaseLayer = (body) => {
  const { id_product, layers } = body;
  const status = 1;
  const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
  // Query untuk menyimpan data kategori baru
  const query =
    "INSERT INTO baselayers (id_product, layers, created_at, status) VALUES (?, ?, ?, ?)";
  const values = [id_product, layers, currentDate, status];
  return db.execute(query, values);
};

const updateBaseLayer = (body) => {
  const { id_product, layers, id } = body;
  // Query untuk menyimpan data kategori baru
  const query = `UPDATE baselayers SET layers='${layers}', id_product='${id_product}' WHERE id='${id}'`;
  return db.execute(query);
};

const deleteBaseLayer = async (id) => {
  const deleteQuery = "DELETE FROM baselayers WHERE id_product = ?";
  const result = await db.execute(deleteQuery, [id]);
  return result;
};

module.exports = {
  getBaseLayer,
  insertBaseLayer,
  updateBaseLayer,
  deleteBaseLayer,
};
