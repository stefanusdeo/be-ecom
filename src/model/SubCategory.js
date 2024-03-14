const db = require("../config/connectDb");
const createSlug = require("../config/createSlug");

// get Categories

const getSubCategoryWithoutImg = (body) => {
  let sqlQuery =
    "SELECT uuid_category, slug, name, created_at, is_custom FROM sub_category WHERE status=1";
  const params = [];

  if (body.category_uuid) {
    sqlQuery += " AND uuid_category = ?";
    params.push(body.category_uuid);
  }

  if (body.id) {
    sqlQuery += " AND id = ?";
    params.push(body.id);
  }

  if (body.slug) {
    sqlQuery += " AND slug = ?";
    params.push(body.slug);
  }

  if (body.name) {
    sqlQuery += " AND name = ?";
    params.push(body.name);
  }

  const data = db.execute(sqlQuery, params);
  return data;
};
const getSubCategory = (body) => {
  let sqlQuery = "SELECT * FROM sub_category WHERE status=1";
  const params = [];

  if (body.category_uuid) {
    sqlQuery += " AND uuid_category = ?";
    params.push(body.category_uuid);
  }

  if (body.id) {
    sqlQuery += " AND id = ?";
    params.push(body.id);
  }

  if (body.slug) {
    sqlQuery += " AND slug = ?";
    params.push(body.slug);
  }

  if (body.name) {
    sqlQuery += " AND name = ?";
    params.push(body.name);
  }

  const data = db.execute(sqlQuery, params);
  return data;
};

const insertSubCategory = (body) => {
  const { uuid_category, name, currentDate, image_classic, image_custom } =
    body;
  const slug = createSlug(name);
  // Query untuk menyimpan data kategori baru
  const query =
    "INSERT INTO sub_category (uuid_category, slug, name, created_at, image_classic, image_custom) VALUES (?,?, ?, ?, ?, ?)";
  const values = [
    uuid_category,
    slug,
    name,
    currentDate,
    image_classic,
    image_custom,
  ];

  return db.execute(query, values);
};

const updateSubCategory = (body) => {
  const { name, id, uuid_category, image_classic, image_custom } = body;
  const slug = createSlug(name);

  // Query untuk menyimpan data kategori baru
  const query = `UPDATE sub_category SET uuid_category='${uuid_category}', name='${name}', slug='${slug}', image_classic='${image_classic}', image_custom='${image_custom}' WHERE id='${id}'`;

  return db.execute(query);
};

const deleteSubCategory = async (body) => {
  const deleteQuery = `UPDATE sub_category SET uuid_category='${body.uuid_category}', name='${body.name}', slug='${body.slug}',status='0' WHERE id='${body.id}'`;
  const result = await db.execute(deleteQuery);
  return result;
};

module.exports = {
  getSubCategory,
  insertSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getSubCategoryWithoutImg,
};
