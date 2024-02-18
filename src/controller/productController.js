const db = require("../config/connectDb");
const ProductModel = require("../model/Product");
const CategoryModel = require("../model/Category");
const SubCategoryModel = require("../model/SubCategory");
const ProductLangModel = require("../model/ProductLang");
const {
  getConnection,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
} = require("../config/transactionDb");

const getProducts = async (req, res, next) => {
  try {
    const page = req.query?.page || 1;
    const pageSize = req.query?.page || 10;
    const [rows] = await ProductModel.getProducts(req.query, page, pageSize);

    return res.json({
      message: "Success Get Data",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

const getProductUuid = async (req, res, next) => {
  try {
    const payload = {
      uuid: req.param.uuid,
    };
    const [rows] = await ProductModel.getProductUuid(payload);
    return res.json({
      message: "Success Get Data",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

const insertProduct = async (req, res, next) => {
  const {
    uuid_category,
    slug_sub_category,
    name,
    size,
    price_dolar,
    price_chf,
    price_eur,
    language,
  } = req.body;
  const main_img = req.file.filename;

  //checking
  const [getCategory] = await CategoryModel.getCategories({
    uuid: uuid_category,
  });
  if (getCategory.length === 0)
    return res.status(404).json({ message: "Category Not Found" });

  const [subCategoryData] = await SubCategoryModel.getSubCategory({
    slug: slug_sub_category,
  });
  if (subCategoryData.length === 0)
    return res.status(404).json({ message: "SubCategory Not Found" });

  if (name.length < 3)
    return res.status(400).json({ message: "Name min 4 Characters" });

  if (!size) return res.status(400).json({ message: "Size Required" });

  if (!price_chf || !price_dolar || !price_eur)
    return res.status(400).json({ message: "Price Required" });

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const payload = {
      uuid_category,
      main_img,
      slug_sub_category,
      name,
      size,
      price_dolar,
      price_chf,
      price_eur,
    };
    const [product] = await ProductModel.insertProduct(payload, connection);
    const id_product = product.insertId;

    const bahasa = JSON.parse(language);
    for (const lang of bahasa) {
      const payloadProLang = {
        id_product,
        description: lang.description,
        information: lang.information,
        language: lang.language,
      };

      await ProductLangModel.insertProductLang(payloadProLang, connection);
    }

    await connection.commit();

    return res.json({
      message: "Success Add Product",
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

module.exports = {
  getProducts,
  getProductUuid,
  insertProduct,
};
