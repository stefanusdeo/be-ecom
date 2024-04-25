const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const OrderModel = require("../model/Orders");
const OrderItemsModel = require("../model/Order_items");
const ProductModel = require("../model/Product");
const CategoryModel = require("../model/Category");
const db = require("../config/connectDb");
const { sendEmailOrder, sendEmailShipping } = require("../utils/email");
const countryData = require("../utils/masterCountry");

const stripe = require("stripe")(process.env.STRIPE_KEY);

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

const getOrder = async (req, res, next) => {
  try {
    const { uuid } = req.query;

    if (!uuid) return res.send(404).json({ message: "UUID Not Found" });

    const [resp] = await OrderModel.getOrdersByUuid(req.query);

    if (resp.length === 0) {
      return res.status(404).json({ message: "Data Not Found" });
    } else {
      return res.send({ message: "success get data", data: resp[0] });
    }
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
    const currencyData = countryData.find(
      (data) => data.name === country.toLowerCase()
    );

    if (!currencyData)
      return res.status(400).json({ message: "Country invalid" });

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
      currency: currencyData.currency,
      shipping_price: currencyData.shipping,
    };

    if (!products)
      return res.status(400).json({ message: "Products Not Found" });

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

    let productAll = [];
    const dataOrder = respOrder[0];

    for (const product of products) {
      const payload = {
        id: product.id,
      };
      let [rows] = await ProductModel.getProductWithoutLang(payload);
      if (rows.length !== 1)
        return res.status(404).json({ message: "product not found" });

      const isProductCustom = rows[0].is_custom;

      if (isProductCustom === 1) {
        if (
          product?.image_custom === undefined ||
          product?.image_custom === ""
        ) {
          return res.status(400).json({ message: "please custom product" });
        }
      }

      let payloadOrderItems = {
        uuid: uuidv4(),
        uuid_order: dataOrder.uuid,
        id_product: rows[0].id,
        qty: product.qty,
        price_per_product:
          currency === "USD"
            ? parseInt(rows[0].price_dolar)
            : currency === "CHF"
            ? parseInt(rows[0].price_chf)
            : parseInt(rows[0].price_eur),
        currentDate: new Date().toISOString().slice(0, 19).replace("T", " "),
        image_custom: product?.image_custom || null,
        image_one: product?.image_one || null,
        image_two: product?.image_two || null,
        image_three: product?.image_three || null,
        image_four: product?.image_four || null,
        size: product?.size,
      };

      const objProduct = {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: rows[0].name,
          },
          unit_amount: payloadOrderItems.price_per_product * 10,
        },
        quantity: payloadOrderItems.qty,
      };

      productAll.push(objProduct);

      const respOi = await OrderItemsModel.insertOrderItems(
        payloadOrderItems,
        connection
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: productAll,
      mode: "payment",
      success_url: `${dataCategory[0].name}transactionStatus?status=success`,
      cancel_url: `${dataCategory[0].name}transactionStatus?status=failed`,
    });

    await connection.commit();
    await sendEmailOrder(email, name, dataCategory[0].name);
    return res.json({
      message: "success Add Data",
      url: session.url,
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    await connection.release();
  }
};

const sendOrder = async (req, res, next) => {
  try {
    const { uuid, noShipping, shipping } = req.body;
    const [checkOrder] = await OrderModel.getOrdersWithotChild(req.query);
    const order = checkOrder[0];
    if (!uuid || order.length === 0) {
      return res.status(404).json({
        message: "Order Not Found!",
      });
    }

    const payload = {
      ...order,
      status: 2,
    };
    const resp = await OrderModel.updateOrders(payload);
    await sendEmailShipping(order.name, noShipping, shipping);
    return res.json({
      message: "Success Update Order",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  insertOrder,
  getOrders,
  getOrder,
  sendOrder,
};
