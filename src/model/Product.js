const db = require("../config/connectDb");
const createSlug = require("../config/createSlug");

const getProductWithoutLang = async (body) => {
  const sqlQuery = `SELECT * FROM products WHERE 1`;
  const params = [];

  if (body.id) {
    sqlQuery += " AND p.id = ?";
    params.push(body.id);
  }
  if (body.uuid) {
    sqlQuery += " AND p.uuid = ?";
    params.push(body.uuid);
  }

  return (product = await db.execute(sqlQuery, params));
};
// get Product
const getProducts = async (body, page = 1, pageSize = 10) => {
  let sqlQuery = `
    SELECT 
      p.*,
      JSON_ARRAYAGG(
        JSON_OBJECT('language', pl.language, 'information', pl.information, 'description', pl.description)
      ) AS product_lang
    FROM 
      products p
    LEFT JOIN 
      product_lang pl ON p.id = pl.id_product
    WHERE 
      1
  `;

  const params = [];

  if (body.uuid) {
    sqlQuery += " AND p.uuid = ?";
    params.push(body.uuid);
  }

  if (body.name) {
    sqlQuery += " AND p.name = ?";
    params.push(body.name);
  }

  if (body.status) {
    sqlQuery += " AND p.status = ?";
    params.push(body.status);
  }

  if (body.category_uuid) {
    sqlQuery += " AND p.category_uuid = ?";
    params.push(body.category_uuid);
  }

  sqlQuery += " GROUP BY p.id, p.name"; // Grupkan hasil berdasarkan UUID dan nama produk

  if (page && pageSize) {
    const offset = (page - 1) * pageSize;
    sqlQuery += " LIMIT ?, ?";
    params.push(`${offset}`, `${pageSize}`);
  }

  const product = await db.execute(sqlQuery, params);

  // Query untuk menghitung total data
  let countQuery = `
      SELECT COUNT(*) AS total_data
      FROM products p
      WHERE 1
    `;

  let paramsCount = [];

  if (body.uuid) {
    countQuery += " AND p.uuid = ?";
    paramsCount.push(body.uuid);
  }

  if (body.name) {
    countQuery += " AND p.name = ?";
    paramsCount.push(body.name);
  }

  if (body.status) {
    countQuery += " AND p.status = ?";
    paramsCount.push(body.status);
  }

  if (body.category_uuid) {
    countQuery += " AND p.category_uuid = ?";
    paramsCount.push(body.category_uuid);
  }

  // Eksekusi query untuk menghitung total data
  const respCount = await db.execute(countQuery, paramsCount);
  return {
    pagination: respCount,
    data: product,
  };
};

const getProductUuid = (body) => {
  let sqlQuery = "SELECT * FROM products WHERE uuid = ?";
  const params = [body.uuid];

  const data = db.execute(sqlQuery, params);

  return data;
};

const insertProduct = (body, connection) => {
  const {
    uuid_category,
    slug_sub_category,
    name,
    main_img,
    size,
    price_dolar,
    price_chf,
    price_eur,
  } = body;
  const slug = createSlug(name);

  const sqlQuery =
    "INSERT INTO products (category_uuid, slug_sub_category, name, slug, main_img, size, price_dolar, price_chf, price_eur) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?)";
  return connection.execute(sqlQuery, [
    uuid_category,
    slug_sub_category,
    name,
    slug,
    main_img,
    size,
    price_dolar,
    price_chf,
    price_eur,
  ]);
};

module.exports = {
  getProducts,
  getProductUuid,
  insertProduct,
  getProductWithoutLang,
};
