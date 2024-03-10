const db = require("../config/connectDb");

const getOrdersWithotChild = async (body, connection) => {
  let sqlQuery = `SELECT * FROM orders WHERE 1`;
  let params = [];
  if (body.id) {
    sqlQuery += " AND id = ?";
    params.push(body.id);
  }

  if (body.uuid) {
    sqlQuery += " AND uuid = ?";
    params.push(body.uuid);
  }

  const data = await connection.execute(sqlQuery, params);
  return data;
};
// get Categories
const getOrders = async (body) => {
  let sqlQuery = `SELECT 
      o.*,
      JSON_ARRAYAGG(
        JSON_OBJECT('id_product', oi.id_product, 'qty', oi.qty, 'price_per_product', oi.price_per_product)
      ) AS order_items
    FROM 
      orders o
    LEFT JOIN 
      order_items oi ON o.uuid = oi.uuid_order
    WHERE 
      1`;
  const params = [];

  if (body.id) {
    sqlQuery += " AND o.id = ?";
    params.push(body.id);
  }

  if (body.uuid) {
    sqlQuery += " AND o.uuid = ?";
    params.push(body.uuid);
  }

  if (body.email) {
    sqlQuery += " AND o.email = ?";
    params.push(body.email);
  }

  if (body.city) {
    sqlQuery += " AND o.city = ?";
    params.push(body.city);
  }

  if (body.email) {
    sqlQuery += " AND o.email = ?";
    params.push(body.email);
  }

  if (body.country) {
    sqlQuery += " AND o.country = ?";
    params.push(body.country);
  }

  if (body.status) {
    sqlQuery += " AND o.status = ?";
    params.push(body.status);
  }

  const offset = (parseInt(body.page) - 1) * parseInt(body.pageSize);

  // Menambahkan LIMIT dan OFFSET ke query SQL
  sqlQuery += ` LIMIT ${parseInt(body.pageSize)} OFFSET ${offset}`;
  const products = await db.execute(sqlQuery, params);

  let countQuery = `
      SELECT COUNT(*) AS total_data
      FROM orders
      WHERE 1
    `;

  let paramsCount = [];

  if (body.id) {
    countQuery += " AND id = ?";
    paramsCount.push(body.id);
  }

  if (body.uuid) {
    countQuery += " AND uuid = ?";
    paramsCount.push(body.uuid);
  }

  if (body.email) {
    countQuery += " AND email = ?";
    paramsCount.push(body.email);
  }

  if (body.city) {
    countQuery += " AND city = ?";
    paramsCount.push(body.city);
  }

  if (body.email) {
    countQuery += " AND email = ?";
    paramsCount.push(body.email);
  }

  if (body.country) {
    countQuery += " AND country = ?";
    paramsCount.push(body.country);
  }

  if (body.status) {
    countQuery += " AND status = ?";
    paramsCount.push(body.status);
  }

  // Eksekusi query untuk menghitung total data
  const respCount = await db.execute(countQuery, paramsCount);
  return {
    data: products,
    pagination: respCount,
  };
};

const insertOrders = async (body, connection) => {
  const {
    uuid,
    email,
    country,
    name,
    address,
    postal_code,
    phone,
    city,
    status,
    currentDate,
    currency,
    shipping_price,
  } = body;

  // Query untuk menyimpan data kategori baru
  const query =
    "INSERT INTO orders (uuid, email, country, name, address, postal_code, phone, city, status, currency, shipping_price, created_at) VALUES (?, ?, ?, ?, ?, ?, ? , ?, ?, ?, ?, ?)";
  const values = [
    uuid,
    email,
    country,
    name,
    address,
    postal_code,
    phone,
    city,
    status,
    currency,
    shipping_price,
    currentDate,
  ];

  const data = await connection.execute(query, values);
  return data;
};

const updateOrders = (body, connection) => {
  const {
    uuid,
    email,
    country,
    name,
    address,
    postal_code,
    phone,
    city,
    status,
  } = body;

  // Waktu sekarang
  const updatedDate = new Date().toISOString().slice(0, 19).replace("T", " ");

  // Query untuk menyimpan data kategori baru
  const query = `UPDATE orders SET email='${email}', country='${country}', name='${name}', address='${address}', postal_code='${postal_code}', phone='${phone}', city='${city}', status='${status}', updated_at='${updatedDate}' WHERE uuid='${uuid}'`;

  return connection.execute(query);
};

const deleteOrder = async (body) => {
  const { uuid, email, country, name, address, postal_code, phone, city } =
    body;

  // Waktu sekarang
  const updatedDate = new Date().toISOString().slice(0, 19).replace("T", " ");
  const status = 3;
  // Query untuk menyimpan data kategori baru
  const query = `UPDATE orders SET email='${email}', country='${country}', name='${name}', address='${address}', postal_code='${postal_code}', phone='${phone}', city='${city}', status='${status}', updated_at='${updatedDate}' WHERE uuid='${uuid}'`;

  return db.execute(query);
};

module.exports = {
  getOrders,
  insertOrders,
  updateOrders,
  deleteOrder,
  getOrdersWithotChild,
};
