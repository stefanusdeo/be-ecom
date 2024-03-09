const db = require("../config/connectDb");

// get Categories
const getOrderItems = async (body) => {
  let sqlQuery = `SELECT * FROM order_items WHERE 1`;
  const params = [];

  if (body.uuid) {
    sqlQuery += " AND uuid = ?";
    params.push(body.uuid);
  }

  if (body.uuid_order) {
    sqlQuery += " AND uuid_order = ?";
    params.push(body.uuid_order);
  }

  if (body.uuid_product) {
    sqlQuery += " AND uuid_product = ?";
    params.push(body.uuid_product);
  }

  const products = await db.execute(sqlQuery, params);
  let countQuery = `
      SELECT COUNT(*) AS total_data
      FROM order_items
      WHERE 1
    `;

  let paramsCount = [];

  if (body.uuid) {
    countQuery += " AND uuid = ?";
    params.push(body.uuid);
  }

  if (body.uuid_order) {
    countQuery += " AND uuid_order = ?";
    params.push(body.uuid_order);
  }

  if (body.uuid_product) {
    countQuery += " AND uuid_product = ?";
    params.push(body.uuid_product);
  }

  // Eksekusi query untuk menghitung total data
  const respCount = await db.execute(countQuery, paramsCount);
  return {
    data: products,
    pagination: respCount,
  };
};

const insertOrderItems = (body, connection) => {
  const {
    uuid,
    uuid_order,
    id_product,
    qty,
    price_per_product,
    currentDate,
    image_custom,
  } = body;

  // Query untuk menyimpan data kategori baru
  const query =
    "INSERT INTO order_items (uuid, uuid_order, id_product, qty, price_per_product, image_custom, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [
    uuid,
    uuid_order,
    id_product,
    qty,
    price_per_product,
    image_custom,
    currentDate,
  ];
  console.log(values);
  return connection.execute(query, values);
};

const deleteOrderById = async (id) => {
  const deleteQuery = "DELETE FROM order_items WHERE id = ?";
  const result = await db.execute(deleteQuery, [id]);
  return result;
};

const deleteOrderByUuidOrder = async (uuid) => {
  const deleteQuery = "DELETE FROM order_items WHERE uuid_order = ?";
  const result = await db.execute(deleteQuery, [uuid]);
  return result;
};

module.exports = {
  getOrderItems,
  insertOrderItems,
  deleteOrderById,
  deleteOrderByUuidOrder,
};
