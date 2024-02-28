const BaseLayerModel = require("../model/BaseLayer");
const { v4: uuidv4 } = require("uuid");

const getBaseLayers = async (req, res, next) => {
  try {
    if (!req.query.id_product)
      return res.status(400).json({ message: "id product required" });
    const [rows] = await BaseLayerModel.getBaseLayer(req.query);

    return res.json({
      message: "Success Get Data",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

const insertBaseLayers = async (req, res, next) => {
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

    await BaseLayerModel.insertCategories(payloadInsert);

    const payloadSearch = {
      uuid,
    };
    const [rows] = await BaseLayerModel.getBaseLayer(payloadSearch);
    return res.json({
      message: "Success Add Data",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

const updateBaseLayer = async (req, res, next) => {
  try {
    const { name, uuid } = req.body;

    if (name.length <= 2) {
      return res.status(400).json({
        message: "Name min 3 characters",
      });
    }

    await BaseLayerModel.updateBaseLayer(req.body);

    const payload = {
      uuid,
    };
    const [rows] = await BaseLayerModel.getBaseLayer(payload);
    return res.json({
      message: "Success Update Data",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBaseLayer = async (req, res, next) => {
  try {
    const { id_product } = req.body;
    if (!req.body.id_product)
      return res.status(400).json({ message: "id product required" });

    const payloadSearch = {
      id_product,
    };
    const [rows] = await BaseLayerModel.getBaseLayer(payloadSearch);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Data Not Found" });
    }

    const response = await BaseLayerModel.deleteBaseLayer(id_product);
    if (response.affectedRows > 0)
      return res.status(200).json({ message: "Data Deleted" });

    return res.status(500).json({ message: "something wrong!" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBaseLayers,
  insertBaseLayers,
  updateBaseLayer,
  deleteBaseLayer,
};
