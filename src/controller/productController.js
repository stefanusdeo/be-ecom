const db = require("../config/connectDb");
const ProductModel = require("../model/Product");
const CategoryModel = require("../model/Category");
const SubCategoryModel = require("../model/SubCategory");
const ProductLangModel = require("../model/ProductLang");
const createSlug = require("../config/createSlug");

const getProducts = async (req, res, next) => {
  try {
    const page = req.query?.page || 1;
    const pageSize = req.query?.pageSize || 10;
    const resp = await ProductModel.getProducts(req.query, page, pageSize);
    const [rows] = resp.data;
    const [totalData] = resp.pagination;
    const pagination = {
      page,
      pageSize,
      totalData: totalData[0].total_data,
      totalPage: Math.ceil(parseInt(totalData[0].total_data || 0) / pageSize),
    };

    return res.json({
      message: "Success Get Data",
      data: rows.length > 0 ? rows : [],
      pagination: pagination,
    });
  } catch (error) {
    next(error);
  }
};

const getProductUuid = async (req, res, next) => {
  try {
    const [rows] = await ProductModel.getProductUuid(req.query);
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
    is_custom,
  } = req.body;
  const main_img = req.file.filename;

  //checking
  const [getCategory] = await CategoryModel.getCategories({
    uuid: uuid_category,
  });
  if (getCategory.length === 0)
    return res.status(404).json({ message: "Category Not Found" });

  const [getProducts] = await ProductModel.getProductWithoutLang({
    slug: createSlug(name),
    slug_sub_category,
  });
  if (getProducts.length === 0)
    return res.status(404).json({ message: "Product Name Already Exists" });

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
      is_custom,
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
      console.log(payloadProLang);
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

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.body;
    const connection = await db.getConnection();
    const payloadSearch = {
      id,
    };
    const [rows] = await ProductModel.getProductWithoutLang(payloadSearch);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Data Not Found" });
    }

    const [response] = await ProductModel.deleteProduct(rows[0], connection);
    if (response.affectedRows > 0)
      return res.status(200).json({ message: "Data Deleted" });

    return res.status(400).json({ message: "Failed Delete" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductUuid,
  insertProduct,
  deleteProduct,
};
