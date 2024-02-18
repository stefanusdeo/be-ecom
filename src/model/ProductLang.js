const db = require("../config/connectDb");

const insertProductLang = (body, connection) => {
  const { id_product, language, description, information } = body;

  // Query untuk menyimpan data kategori baru
  const query =
    "INSERT INTO product_lang (id_product, language, description, information) VALUES (?, ?, ?, ?)";
  const values = [id_product, language, description, information];
  return connection.execute(query, values);
};

module.exports = {
  insertProductLang,
};
