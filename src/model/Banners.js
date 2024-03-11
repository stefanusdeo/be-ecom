const db = require("../config/connectDb");

// get Categories
const getBanners = async (body) => {
  let sqlQuery = `SELECT 
  b.*,
  JSON_OBJECT(
    'product_id', p.id,
    'product_name', p.name,
    'slug',p.slug
  ) AS product
FROM 
  banners b
INNER JOIN
  products p ON b.id_product = p.id
    WHERE 
      1`;
  const params = [];

  if (body.id) {
    sqlQuery += " AND b.id = ?";
    params.push(body.id);
  }

  if (body.uuid_category) {
    sqlQuery += " AND b.uuid_category = ?";
    params.push(body.uuid_category);
  }

  if (body.type) {
    sqlQuery += " AND b.type = ?";
    params.push(body.type);
  }
  const [data] = await db.execute(sqlQuery, params);

  return [data];
};

const insertBanners = async (body) => {
  const { uuid_category, image, id_product, type } = body;

  // Query untuk menyimpan data kategori baru
  const query =
    "INSERT INTO banners (uuid_category, image, id_product, type) VALUES (?, ?, ?, ?)";
  const values = [uuid_category, image, id_product, type];

  return await db.execute(query, values);
};

const updateBanners = async (body) => {
  const { uuid_category, image, type, id } = body;

  // Waktu sekarang

  // Query untuk menyimpan data kategori baru
  const query =
    "UPDATE banners SET uuid_category=?, type=?, image=? WHERE id=?";
  const params = [uuid_category, type, image, id];

  return await db.execute(query, params);
};

const deleteBanners = async (id) => {
  const deleteQuery = "DELETE FROM banners WHERE id = ?";
  const result = await db.execute(deleteQuery, [id]);
  return result;
};

module.exports = {
  getBanners,
  insertBanners,
  updateBanners,
  deleteBanners,
};
