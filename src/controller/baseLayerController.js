const BaseLayerModel = require("../model/BaseLayer");
const ProductModel = require("../model/Product");

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
    const { id_product, layers } = req.body;
    if (!id_product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    const [rows] = await ProductModel.getProductWithoutLang({ id: id_product });
    if (rows.length !== 1) {
      return res.status(404).json({ message: "product Not found" });
    }

    const payloadInsert = {
      id_product,
      layers,
    };

    await BaseLayerModel.insertBaseLayer(payloadInsert);

    return res.json({
      message: "Success Add Data",
      data: payloadInsert,
    });
  } catch (error) {
    next(error);
  }
};

const updateBaseLayer = async (req, res, next) => {
  try {
    const { id_product } = req.body;

    if (!id_product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    const [products] = await ProductModel.getProductWithoutLang({
      id: id_product,
    });
    if (products.length !== 1) {
      return res.status(404).json({ message: "product Not found" });
    }

    await BaseLayerModel.updateBaseLayer(req.body);

    return res.json({
      message: "Success Update Data",
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
