const db = require("../config/connectDb");
const createSlug = require("../config/createSlug");

// get Categories
const getBaseLayer = async (body) => {
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

  if (body.number) {
    sqlQuery += " AND number = ?";
    params.push(body.number);
  }

  const page = body?.page || 1;
  const pageSize = body?.pageSize || 10;

  if (page && pageSize) {
    const offset = (page - 1) * pageSize;
    sqlQuery += " LIMIT ?, ?";
    params.push(`${offset}`, `${pageSize}`);
  }

  const layers = await db.execute(sqlQuery, params);

  let countQuery = `
      SELECT COUNT(*) AS total_data
      FROM baselayers b
      WHERE 1
    `;

  let paramsCount = [];

  if (body.id) {
    sqlQuery += " AND b.id = ?";
    paramsCount.push(body.id);
  }

  if (body.status) {
    sqlQuery += " AND b.status = ?";
    paramsCount.push(body.status);
  }

  if (body.id_product) {
    sqlQuery += " AND b.id_product = ?";
    paramsCount.push(body.id_product);
  }

  if (body.number) {
    sqlQuery += " AND b.number = ?";
    paramsCount.push(body.number);
  }

  const respCount = await db.execute(countQuery, paramsCount);
  return {
    pagination: respCount,
    data: layers,
  };
};

const insertBaseLayer = (body) => {
  const { id_product, layers, number } = body;
  const status = 1;
  const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
  // Query untuk menyimpan data kategori baru
  const query =
    "INSERT INTO baselayers (id_product, layers,number, created_at, status) VALUES (?, ?, ?, ?, ?)";
  const values = [id_product, layers, number, currentDate, status];
  return db.execute(query, values);
};

const updateBaseLayer = (body) => {
  const { id_product, layers, id, number } = body;
  // Query untuk menyimpan data kategori baru
  const query = `UPDATE baselayers SET layers='${layers}', number='${number}', id_product='${id_product}' WHERE id='${id}'`;
  return db.execute(query);
};

const deleteBaseLayer = async (id) => {
  const deleteQuery = "DELETE FROM baselayers WHERE id = ?";
  const result = await db.execute(deleteQuery, [id]);
  return result;
};

module.exports = {
  getBaseLayer,
  insertBaseLayer,
  updateBaseLayer,
  deleteBaseLayer,
};
