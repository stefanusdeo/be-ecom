const BannersModel = require("../model/Banners");
const CategoryModel = require("../model/Category");
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
    const { uuid_category, id_product } = req.body;
    const image = req.file.filename;

    if (!image) {
      return res.status(400).json({ message: "Image Require" });
    }

    if (!id_product) {
      return res.status(400).json({ message: "Product Require" });
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

    const resp = await BannersModel.insertBanners({
      uuid_category,
      image,
      id_product,
    });
    return res.status(200).json({ message: "Success Add Data" });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { uuid_category, created_at, image, id } = req.body;

    const payloadCategory = {
      uuid: uuid_category,
    };
    const [respCategory] = await CategoryModel.getCategories(payloadCategory);
    if (respCategory.length === 0) {
      return res.status(404).json({
        message: "Category Not Found!",
      });
    }

    const updateValues = {
      id,
      uuid_category,
      image: req.file ? req.file.filename : image, // Gunakan gambar baru jika dikirim, jika tidak, gunakan gambar yang ada di body
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
    if (response.affectedRows > 0)
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
