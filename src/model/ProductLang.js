const db = require("../config/connectDb");

const insertProductLang = (body, connection) => {
  const { id_product, language, description, information } = body;

  // Query untuk menyimpan data kategori baru
  const query =
    "INSERT INTO product_lang (id_product, language, description, information) VALUES (?, ?, ?, ?)";
  const values = [id_product, language, description, information];
  return connection.execute(query, values);
};

const deleteProductLangWithIdProduct = async (id, connection) => {
  const deleteQuery = "DELETE FROM product_lang WHERE id_product = ?";
  const result = await connection.execute(deleteQuery, [id]);
  return result;
};

module.exports = {
  insertProductLang,
  deleteProductLangWithIdProduct,
};
