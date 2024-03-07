const SubCategory = require("../model/SubCategory");
const CategoryModel = require("../model/Category");
const { v4: uuidv4 } = require("uuid");

const getSubCategory = async (req, res, next) => {
  try {
    const [rows] = await SubCategory.getSubCategory(req.query);

    return res.json({
      message: "Success Get Data",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

const insertSubCategory = async (req, res, next) => {
  try {
    const { name, uuid_category, image_classic, image_custom } = req.body;

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
    const payloadCheck = {
      uuid_category,
      name,
    };

    let [rows] = await SubCategory.getSubCategory(payloadCheck);

    if (rows.length > 0) {
      return res.status(400).json({ message: "Name Already Exists!" });
    }

    // Waktu sekarang
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");

    if (name.length <= 2) {
      return res.status(400).json({
        message: "Name min 3 characters",
      });
    }

    const payloadInsert = {
      uuid_category,
      name,
      currentDate,
      image_classic,
      image_custom,
    };

    await SubCategory.insertSubCategory(payloadInsert);

    return res.json({
      message: "Success Add Data",
      data: [payloadInsert],
    });
  } catch (error) {
    next(error);
  }
};

const updateSubCategory = async (req, res, next) => {
  try {
    const { name, uuid_category, id, image_classic, image_custom } = req.body;

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

    const payloadUpdate = {
      id,
      name,
      uuid_category,
      image_classic,
      image_custom,
    };
    await SubCategory.updateSubCategory(payloadUpdate);

    const data = {
      uuid_category,
      name,
    };
    return res.json({
      message: "Success Update Data",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSubCategory = async (req, res, next) => {
  try {
    const { id } = req.body;

    const payloadSearch = {
      id,
    };
    const [rows] = await SubCategory.getSubCategory(payloadSearch);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Data Not Found" });
    }

    const [response] = await SubCategory.deleteSubCategory(rows[0]);
    if (response.affectedRows > 0)
      return res.status(200).json({ message: "Data Deleted" });

    return res.status(400).json({ message: "Failed Delete" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubCategory,
  insertSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
