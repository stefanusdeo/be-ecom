const BannersModel = require("../model/Banners");
const CategoryModel = require("../model/Category");
const ProductModel = require("../model/Product");
const { v4: uuidv4 } = require("uuid");

const get = async (req, res, next) => {
  try {
    const [rows] = await BannersModel.getBanners(req.query);

    return res.json({
      message: "Success Get Data",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

const insert = async (req, res, next) => {
  try {
    const { uuid_category, id_product, image, type } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Image Require" });
    }

    if (!id_product) {
      return res.status(400).json({ message: "Product Require" });
    }

    if (!type) {
      return res.status(400).json({ message: "Type Require" });
    }

    //check
    const payloadCategory = {
      uuid: uuid_category,
    };
    const [respCategory] = await CategoryModel.getCategories(payloadCategory);
    if (respCategory.length === 0) {
      return res.status(404).json({
        message: "Category Not Found!",
      });
    }

    const payloadProduct = {
      category_uuid: uuid_category,
      id: id_product,
    };
    const [respProduct] = await ProductModel.getProductWithoutLang(
      payloadProduct
    );
    if (respProduct.length === 0) {
      return res.status(404).json({
        message: "Product Not Found!",
      });
    }

    const resp = await BannersModel.insertBanners({
      uuid_category,
      image,
      id_product,
      type,
    });
    return res.status(200).json({ message: "Success Add Data" });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { uuid_category, type, image, id, id_product } = req.body;

    if (!type) {
      return res.status(400).json({ message: "Type Require" });
    }

    const payloadCategory = {
      uuid: uuid_category,
    };
    const [respCategory] = await CategoryModel.getCategories(payloadCategory);
    if (respCategory.length === 0) {
      return res.status(404).json({
        message: "Category Not Found!",
      });
    }

    const payloadProduct = {
      category_uuid: uuid_category,
      id: id_product,
    };
    const [respProduct] = await ProductModel.getProductWithoutLang(
      payloadProduct
    );
    if (respProduct.length === 0) {
      return res.status(404).json({
        message: "Product Not Found!",
      });
    }

    const updateValues = {
      id,
      uuid_category,
      image,
      type,
    };

    const resp = await BannersModel.updateBanners(updateValues);
    return res.status(200).json({ message: "Success Edit Data" });
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.query;

    const payloadSearch = {
      id,
    };

    const [rows] = await BannersModel.getBanners(payloadSearch);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Data Not Found" });
    }

    const response = await BannersModel.deleteBanners(id);
    return res.status(200).json({ message: "Data Deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  get,
  insert,
  update,
  destroy,
};
