const BaseLayerModel = require("../model/BaseLayer");
const ProductModel = require("../model/Product");

const getBaseLayers = async (req, res, next) => {
  try {
    const resp = await BaseLayerModel.getBaseLayer(req.query);
    const layers = resp.data[0];
    const pagination = resp.pagination[0][0];
    const pageSize = req?.query?.pageSize || 10;
    const paginationData = {
      page: req?.query?.page || 1,
      pageSize,
      totalData: pagination.total_data,
      totalPage: Math.ceil(parseInt(pagination.total_data || 0) / pageSize),
    };

    return res.json({
      message: "Success Get Data",
      data: layers,
      pagination: paginationData,
    });
  } catch (error) {
    next(error);
  }
};

const insertBaseLayers = async (req, res, next) => {
  try {
    const { id_product, layers, type } = req.body;
    if (!id_product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    const respLayers = await BaseLayerModel.getBaseLayer({
      id_product,
      type,
    });
    const listLayers = respLayers.data[0];
    if (listLayers.length > 0) {
      return res
        .status(404)
        .json({ message: `layer type ${type} already exists` });
    }

    const [rows] = await ProductModel.getProductWithoutLang({ id: id_product });
    if (rows.length !== 1) {
      return res.status(404).json({ message: "product Not found" });
    }

    const payloadInsert = {
      id_product,
      layers,
      type,
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
    const { id_product, id } = req.body;

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
    const { id } = req.body;
    if (!req.body.id)
      return res.status(400).json({ message: "id product required" });

    const payloadSearch = {
      id,
    };
    const resplayers = await BaseLayerModel.getBaseLayer(payloadSearch);
    const rows = resplayers.data;
    if (rows.length === 0) {
      return res.status(404).json({ message: "Data Not Found" });
    }

    const response = await BaseLayerModel.deleteBaseLayer(id);
    return res.status(200).json({ message: "Data Deleted" });
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
