const EmailModel = require("../model/Email");

const getEmail = async (req, res, next) => {
  try {
    const page = req.query?.page || 1;
    const pageSize = req.query?.pageSize || 10;
    const resp = await EmailModel.getMail(req.query, page, pageSize);
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
      pagination: pagination,
    });
  } catch (error) {
    next(error);
  }
};

const createEmail = async (req, res, next) => {
  try {
    const resp = await EmailModel.insert(req.body);

    return res.status(200).json({ message: "success send message" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getEmail, createEmail };
