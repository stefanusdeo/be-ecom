const AboutUsModel = require("../model/AboutUs");
const CategoryModel = require("../model/Category");
const { v4: uuidv4 } = require("uuid");

const getAboutUs = async (req, res, next) => {
  try {
    if (!req.query.category_uuid)
      return res.status(400).json({ message: "uuid Category Required" });
    const [rows] = await AboutUsModel.getAboutUs(req.query);
    if (rows.length < 1) return res.status(404).json({ message: "Not Found" });
    return res.json({
      message: "Success Get Data",
      data: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const insertAboutUs = async (req, res, next) => {
  try {
    const { content, category_uuid } = req.body;

    //check
    const payloadCategory = {
      uuid: category_uuid,
    };
    const [respCategory] = await CategoryModel.getCategories(payloadCategory);
    if (respCategory.length === 0) {
      return res.status(404).json({
        message: "Category Not Found!",
      });
    }
    const payloadCheck = {
      category_uuid,
    };
    let [rows] = await AboutUsModel.getAboutUs(payloadCheck);

    if (rows.length > 0) {
      return res.status(400).json({
        message: "Content about us already exists! for this category",
      });
    }

    // Waktu sekarang
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");

    const payloadInsert = {
      category_uuid,
      content,
      currentDate,
    };
    console.log(payloadInsert);
    await AboutUsModel.insertAboutUs(payloadInsert);

    return res.json({
      message: "Success Add Data",
      data: [payloadInsert],
    });
  } catch (error) {
    next(error);
  }
};

const updateAboutUs = async (req, res, next) => {
  try {
    const { content, category_uuid, id } = req.body;

    //check
    const payloadCategory = {
      uuid: category_uuid,
    };
    const [respCategory] = await CategoryModel.getCategories(payloadCategory);
    if (respCategory.length === 0) {
      return res.status(404).json({
        message: "Category Not Found!",
      });
    }

    const payloadAboutUsCheck = {
      id,
    };
    const [respAboutUs] = await AboutUsModel.getAboutUs(payloadAboutUsCheck);
    if (respAboutUs.length === 0) {
      return res.status(404).json({
        message: "About Us Content Not Found!",
      });
    }

    const payloadUpdate = {
      id,
      content,
      category_uuid,
    };
    await AboutUsModel.updateAboutUs(payloadUpdate);

    const data = {
      category_uuid,
      content,
    };
    return res.json({
      message: "Success Update Data",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAboutUs = async (req, res, next) => {
  try {
    const { id } = req.body;

    const payloadSearch = {
      id,
    };
    const [rows] = await AboutUsModel.getAboutUs(payloadSearch);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Data Not Found" });
    }

    const [response] = await AboutUsModel.deleteAboutUs(id);
    if (response.affectedRows > 0)
      return res.status(200).json({ message: "Data Deleted" });

    return res.status(400).json({ message: "Failed Delete" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAboutUs,
  insertAboutUs,
  updateAboutUs,
  deleteAboutUs,
};
