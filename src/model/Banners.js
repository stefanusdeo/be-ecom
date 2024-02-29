const db = require("../config/connectDb");

// get Categories
const getBanners = (body) => {
  let sqlQuery = `SELECT 
      b.*,
      JSON_ARRAYAGG(
        JSON_OBJECT('slug', p.slug, 'name', p.name, 'id', p.id)
      ) AS product
    FROM 
      banners b
    LEFT JOIN 
      products p ON b.id_product = p.id
    WHERE 
      1`;
  const params = [];

  if (body.id) {
    sqlQuery += " AND id = ?";
    params.push(body.id);
  }

  if (body.uuid_category) {
    sqlQuery += " AND uuid_category = ?";
    params.push(body.uuid_category);
  }

  const data = db.execute(sqlQuery, params);
  return data;
};

const insertBanners = (body) => {
  const { uuid_category, image, currentDate, id_product } = body;

  // Query untuk menyimpan data kategori baru
  const query =
    "INSERT INTO banners (uuid_category, image, id_product, created_at) VALUES (?, ?, ?, ?)";
  const values = [uuid_category, image, id_product, currentDate];

  return db.execute(query, values);
};

const updateBanners = (body) => {
  const { uuid_category, image, id } = body;

  // Waktu sekarang

  // Query untuk menyimpan data kategori baru
  const query = "UPDATE banners SET uuid_category=?, image=? WHERE id=?";
  const params = [uuid_category, image, id];

  return db.execute(query, params);
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
