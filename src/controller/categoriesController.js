const CategoryModel = require("../model/Category");
const { v4: uuidv4 } = require("uuid");

const getCategories = async (req, res, next) => {
  try {
    const [rows] = await CategoryModel.getCategories(req.query);

    return res.json({
      message: "Success Get Data",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

const insertCategories = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Generate UUID
    const uuid = uuidv4();

    // Waktu sekarang
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");

    if (name.length <= 2) {
      return res.status(400).json({
        message: "Name min 3 characters",
      });
    }

    const payloadInsert = {
      uuid,
      name,
      currentDate,
    };

    await CategoryModel.insertCategories(payloadInsert);

    const payloadSearch = {
      uuid,
    };
    const [rows] = await CategoryModel.getCategories(payloadSearch);
    return res.json({
      message: "Success Add Data",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategories = async (req, res, next) => {
  try {
    const { name, uuid } = req.body;

    if (name.length <= 2) {
      return res.status(400).json({
        message: "Name min 3 characters",
      });
    }

    await CategoryModel.updateCategories(req.body);

    const payload = {
      uuid,
    };
    const [rows] = await CategoryModel.getCategories(payload);
    return res.json({
      message: "Success Update Data",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategories = async (req, res, next) => {
  try {
    const { uuid } = req.query;

    const payloadSearch = {
      uuid,
    };
    const [rows] = await CategoryModel.getCategories(payloadSearch);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Data Not Found" });
    }

    const response = await CategoryModel.deleteCategories(uuid);
    if (response.affectedRows > 0)
      return res.status(200).json({ message: "Data Deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  insertCategories,
  updateCategories,
  deleteCategories,
};
