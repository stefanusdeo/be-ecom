const db = require("../config/connectDb");

// get Categories
const getProductImg = (body) => {
  let sqlQuery = "SELECT * FROM product_img WHERE 1";
  const params = [];

  if (body.id_product) {
    sqlQuery += " AND id_product = ?";
    params.push(body.id_product);
  }

  if (body.id) {
    sqlQuery += " AND id = ?";
    params.push(body.id);
  }

  const data = db.execute(sqlQuery, params);
  return data;
};

const insertProductImg = (body) => {
  const { img, id_product } = body;

  // Query untuk menyimpan data kategori baru
  const query = "INSERT INTO product_img (img, id_product) VALUES (?, ?)";
  const values = [img, id_product];

  return db.execute(query, values);
};

const updateProductImg = (body) => {
  const { img, id_product, id } = body;

  // Query untuk menyimpan data kategori baru
  const query = `UPDATE product_img SET img='${img}', id_product='${id_product}' WHERE id='${id}'`;

  return db.execute(query);
};

const deleteProductImg = async (id) => {
  const deleteQuery = "DELETE FROM product_img WHERE id = ?";
  const result = await db.execute(deleteQuery, [id]);
  return result;
};

module.exports = {
  getProductImg,
  insertProductImg,
  updateProductImg,
  deleteProductImg,
};
