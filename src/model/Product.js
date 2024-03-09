const db = require("../config/connectDb");
const createSlug = require("../config/createSlug");

const getProductWithoutLang = async (body) => {
  let sqlQuery = `SELECT * FROM products WHERE 1`;
  const params = [];

  if (body.id) {
    sqlQuery += " AND id = ?";
    params.push(body.id);
  }
  if (body.slug) {
    sqlQuery += " AND slug = ?";
    params.push(body.slug);
  }

  if (body.slug_sub_category) {
    sqlQuery += " AND slug_sub_category = ?";
    params.push(body.slug_sub_category);
  }

  if (body.category_uuid) {
    sqlQuery += " AND category_uuid = ?";
    params.push(body.category_uuid);
  }

  if (body.is_custom) {
    sqlQuery += " AND is_custom = ?";
    params.push(body.is_custom);
  }

  return await db.execute(sqlQuery, params);
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
  if (body.id) {
    sqlQuery += " AND p.id = ?";
    params.push(body.id);
  }

  if (body.slug_sub_category) {
    sqlQuery += " AND p.slug_sub_category = ?";
    params.push(body.slug_sub_category);
  }

  if (body.slug) {
    sqlQuery += " AND p.slug = ?";
    params.push(body.slug);
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

  if (body.is_custom) {
    sqlQuery += " AND p.is_custom = ?";
    params.push(body.is_custom);
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

  if (body.id) {
    countQuery += " AND p.id = ?";
    paramsCount.push(body.id);
  }
  if (body.slug) {
    countQuery += " AND p.slug = ?";
    paramsCount.push(body.slug);
  }

  if (body.slug_sub_category) {
    countQuery += " AND p.slug_sub_category = ?";
    paramsCount.push(body.slug_sub_category);
  }

  if (body.is_custom) {
    countQuery += " AND p.is_custom = ?";
    paramsCount.push(body.is_custom);
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

const insertProduct = async (body, connection) => {
  const {
    uuid_category,
    slug_sub_category,
    name,
    main_img,
    size,
    price_dolar,
    price_chf,
    price_eur,
    is_custom,
  } = body;
  const slug = await createSlug(name);
  const status = 1;
  const sqlQuery = `INSERT INTO products (category_uuid, slug_sub_category, name, slug, main_img, size, price_dolar, price_chf, price_eur, status, is_custom) 
  VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
    status,
    parseInt(is_custom),
  ]);
};

const updateProduct = (body, connection) => {
  const {
    uuid_category,
    slug_sub_category,
    name,
    main_img,
    size,
    price_dolar,
    price_chf,
    price_eur,
    is_custom,
    id,
  } = body;
  const slug = createSlug(name);
  const sqlQuery = `UPDATE products SET category_uuid='${uuid_category}', slug_sub_category='${slug_sub_category}', name='${name}', slug='${slug}', main_img='${main_img}', size='${size}', price_dolar='${price_dolar}', price_chf='${price_chf}', price_eur='${price_eur}', is_custom='${is_custom}' WHERE id=${id}`;
  return connection.execute(sqlQuery);
};

const deleteProduct = (body, connection) => {
  const {
    id,
    uuid,
    category_uuid,
    slug_sub_category,
    name,
    main_img,
    size,
    price_dolar,
    price_chf,
    price_eur,
    is_custom,
  } = body;
  const slug = createSlug(name);

  const sqlQuery = `UPDATE products SET slug='${slug}', category_uuid='${category_uuid}', slug_sub_category='${slug_sub_category}', name='${name}', slug='${slug}', main_img='${main_img}', size='${size}', price_dolar='${price_dolar}', price_chf='${price_chf}', price_eur='${price_eur}', is_custom='${is_custom}', status='0' WHERE id='${id}'`;
  return connection.execute(sqlQuery);
};

module.exports = {
  getProducts,
  getProductUuid,
  insertProduct,
  getProductWithoutLang,
  deleteProduct,
  updateProduct,
};
