const productModel = require("../model/Product");
const productImgModel = require("../model/ProductImage");

const getProductImg = async (req, res, next) => {
  const { id_product } = req.query;
  if (!id_product)
    return res.status(400).json({ message: "Please insert id product" });

  const [products] = await productModel.getProductWithoutLang({
    id: id_product,
  });
  if (products.length !== 1) {
    return res.status(404).json({ message: "product Not found" });
  }

  const [rows] = await productImgModel.getProductImg(req.query);
  return res.json({ message: "success get Data", data: rows });
};

const insertProductImg = async (req, res, next) => {
  try {
    const { id_product, img } = req.body;
    if (!id_product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    const [rows] = await productModel.getProductWithoutLang({ id: id_product });
    if (rows.length !== 1) {
      return res.status(404).json({ message: "product Not found" });
    }

    const payloadInsert = {
      id_product,
      img,
    };

    await productImgModel.insertProductImg(payloadInsert);

    return res.json({
      message: "Success Add Data",
      data: payloadInsert,
    });
  } catch (error) {
    next(error);
  }
};

const updateProductImg = async (req, res, next) => {
  try {
    const { id_product, img, id } = req.body;
    if (!id_product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    const [rows] = await productModel.getProductWithoutLang({ id: id_product });
    if (rows.length !== 1) {
      return res.status(404).json({ message: "product Not found" });
    }

    const [productImgs] = await productImgModel.getProductImg({
      id,
    });
    if (productImgs.length !== 1) {
      return res.status(404).json({ message: "Img Not found" });
    }

    const payloadInsert = {
      id_product,
      img,
      id,
    };

    await productImgModel.updateProductImg(payloadInsert);

    return res.json({
      message: "Success Add Data",
      data: payloadInsert,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProductImg = async (req, res, next) => {
  try {
    const { id } = req.query;
    if (!req.body.id)
      return res.status(400).json({ message: "id product required" });

    const response = await BaseLayerModel.deleteBaseLayer(id);
    return res.status(200).json({ message: "Data Deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductImg,
  insertProductImg,
  updateProductImg,
  deleteProductImg,
};
