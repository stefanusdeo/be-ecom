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
    const currency = req.query?.currency || "";
    const payload = {
      ...req.query,
      column_price:
        currency === "CHF"
          ? "price_chf"
          : currency === "USD"
          ? "price_dolar"
          : currency === "EUR"
          ? "price_eur"
          : undefined,
      sortBy:
        req.query.sortBy === "price"
          ? currency === "CHF"
            ? "price_chf"
            : currency === "USD"
            ? "price_dolar"
            : "price_eur"
          : req.query.sortBy,
    };
    const resp = await ProductModel.getProducts(payload, page, pageSize);
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
    main_img,
  } = req.body;

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
  if (getProducts.length === 1)
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
      slug_sub_category,
      name,
      size,
      price_dolar,
      price_chf,
      price_eur,
      is_custom,
      main_img,
    };
    const [product] = await ProductModel.insertProduct(payload, connection);
    const id_product = product.insertId;

    const bahasa =
      typeof language === "string" ? JSON.parse(language) : language;
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

const updateProduct = async (req, res, next) => {
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
    id,
    main_img,
  } = req.body;

  if (!uuid_category)
    return res.status(400).json({ message: "Category Required" });
  if (!slug_sub_category)
    return res.status(400).json({ message: "SubCategory Required" });

  const [getProducts] = await ProductModel.getProductWithoutLang({
    id,
  });

  if (getProducts.length !== 1)
    return res.status(404).json({ message: "Product Not found" });

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
      is_custom,
      id,
    };
    const [product] = await ProductModel.updateProduct(payload, connection);
    const id_product = id;

    if (!language)
      return res.status(400).json({ message: "Language is Required" });

    const respDel = await ProductLangModel.deleteProductLangWithIdProduct(
      id_product,
      connection
    );
    if (respDel.affectedRows < 1) throw new Error("Failed Delete Product Lang");

    const bahasa =
      typeof language === "string" ? JSON.parse(language) : language;
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
      message: "Success Edit Product",
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
    const { id } = req.query;
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
  updateProduct,
};
