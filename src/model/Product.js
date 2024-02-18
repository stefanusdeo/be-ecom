const db = require("../config/connectDb");
const createSlug = require("../config/createSlug");

// get Product
const getProducts = (body, page = 1, pageSize = 10) => {
  let sqlQuery = "SELECT * FROM products WHERE status=1";
  const params = [];

  if (body.uuid) {
    sqlQuery += " AND uuid = ?";
    params.push(body.uuid);
  }

  if (body.name) {
    sqlQuery += " AND name = ?";
    params.push(body.name);
  }

  if (body.category_uuid) {
    sqlQuery += " AND category_uuid = ?";
    params.push(body.category_uuid);
  }

  if (page && pageSize) {
    const offset = (page - 1) * pageSize;
    sqlQuery += " LIMIT ?, ?";
    params.push(offset, pageSize);
  }

  const data = db.execute(sqlQuery, params);
  return data;
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
};
