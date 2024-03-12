const TermConditionsModel = require("../model/TermConditions");
const CategoryModel = require("../model/Category");
const { v4: uuidv4 } = require("uuid");

const get = async (req, res, next) => {
  try {
    if (!req.query.category_uuid)
      return res.status(400).json({ message: "uuid Category Required" });
    const [rows] = await TermConditionsModel.getTermCondition(req.query);
    if (rows.length < 1) return res.status(404).json({ message: "Not Found" });
    return res.json({
      message: "Success Get Data",
      data: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const insert = async (req, res, next) => {
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
    let [rows] = await TermConditionsModel.getTermCondition(payloadCheck);

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
    await TermConditionsModel.insertTermCondition(payloadInsert);

    return res.json({
      message: "Success Add Data",
      data: [payloadInsert],
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
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
    const [respAboutUs] = await TermConditionsModel.getTermCondition(
      payloadAboutUsCheck
    );
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
    await TermConditionsModel.updateTermCondition(payloadUpdate);

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

const deleteData = async (req, res, next) => {
  try {
    const { id } = req.body;

    const payloadSearch = {
      id,
    };
    const [rows] = await TermConditionsModel.getTermCondition(payloadSearch);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Data Not Found" });
    }

    const [response] = await TermConditionsModel.deleteTermCondition(id);
    if (response.affectedRows > 0)
      return res.status(200).json({ message: "Data Deleted" });

    return res.status(400).json({ message: "Failed Delete" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  get,
  insert,
  update,
  deleteData,
};
