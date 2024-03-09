const { v4: uuidv4 } = require("uuid");
const OrderModel = require("../model/Orders");
const OrderItemsModel = require("../model/Order_items");
const ProductModel = require("../model/Product");
const CategoryModel = require("../model/Category");
const db = require("../config/connectDb");
const { sendMail } = require("../utils/email");

const getOrders = async (req, res, next) => {
  try {
    const page = req.query?.page || 1;
    const pageSize = req.query?.pageSize || 10;
    const payloadGetData = {
      ...req.query,
      page,
      pageSize,
    };
    const resp = await OrderModel.getOrders(payloadGetData);
    const [rows] = resp.data;
    const [totalData] = resp.pagination;
    const pagination = {
      page,
      pageSize,
      totalData: totalData[0].total_data,
      totalPage: Math.ceil(parseInt(totalData[0].total_data || 0) / pageSize),
    };
    return res.json({
      message: "Success Get Data",
      data: rows.length > 0 ? rows : [],
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

const insertOrder = async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const {
      email,
      country,
      name,
      address,
      postal_code,
      phone,
      city,
      products,
      currency,
      uuid_category,
    } = req.body;
    const uuid = uuidv4();

    const payloadOrder = {
      uuid,
      email,
      country,
      name,
      address,
      postal_code,
      phone,
      city,
      currentDate: new Date().toISOString().slice(0, 19).replace("T", " "),
      status: 1,
    };
    if (products.length < 1)
      return res.status(400).json({ message: "Invalid Product" });

    if (!uuid_category)
      return res.status(400).json({ message: "Invalid Category" });

    const [dataCategory] = await CategoryModel.getCategories({
      uuid: uuid_category,
    });
    if (dataCategory.length < 1)
      return res.status(404).json({ message: "Category Not Found!" });
    const [order] = await OrderModel.insertOrders(payloadOrder, connection);
    const orderId = order.insertId;
    const payloadGetOrder = {
      id: orderId,
    };
    const [respOrder] = await OrderModel.getOrdersWithotChild(
      payloadGetOrder,
      connection
    );
    const dataOrder = respOrder[0];
    for (const product of products) {
      const payload = {
        id: product.id,
      };
      let [rows] = await ProductModel.getProductWithoutLang(payload);
      if (rows.length !== 1) throw new Error("Product Not Found!");

      let payloadOrderItems = {
        uuid: uuidv4(),
        uuid_order: dataOrder.uuid,
        id_product: rows[0].id,
        qty: product.qty,
        price_per_product:
          currency === "USD"
            ? rows[0].price_dolar
            : currency === "CHF"
            ? rows[0].price_chf
            : rows[0].price_eur,
        currentDate: new Date().toISOString().slice(0, 19).replace("T", " "),
        image_custom: product?.image_custom || null,
      };
      const respOi = await OrderItemsModel.insertOrderItems(
        payloadOrderItems,
        connection
      );
      console.log(respOi);
    }

    await connection.commit();
    // await sendMail(email, name, dataCategory[0].name);
    return res.json({
      message: "success Add Data",
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    await connection.release();
  }
};

const updateStatusOrder = async (req, res, next) => {
  const connection = db.getConnection();
  try {
    await connection.beginTransaction();
    const { uuid, status } = req.body;
    const [data] = await OrderModel.getOrdersWithotChild({ uuid }, connection);

    let dataOrder = data[0];
    let payloadOrder = {
      ...dataOrder,
      status,
    };

    await OrderModel.updateOrders(payloadOrder, connection);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    next(error);
  }
};

module.exports = {
  insertOrder,
  getOrders,
  updateStatusOrder,
};
