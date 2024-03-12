const db = require("../config/connectDb");
const createSlug = require("../config/createSlug");

// get Categories
const getTermCondition = (body) => {
  let sqlQuery = "SELECT * FROM termconditions WHERE 1";
  const params = [];

  if (body.id) {
    sqlQuery += " AND id = ?";
    params.push(body.id);
  }
  if (body.category_uuid) {
    sqlQuery += " AND category_uuid = ?";
    params.push(body.category_uuid);
  }

  const data = db.execute(sqlQuery, params);
  return data;
};

const insertTermCondition = (body) => {
  const { category_uuid, content, currentDate } = body;
  // Query untuk menyimpan data kategori baru
  const query =
    "INSERT INTO termconditions (category_uuid, content, created_at) VALUES (?, ?, ?)";
  const values = [category_uuid, content, currentDate];
  return db.execute(query, values);
};

const updateTermCondition = (body) => {
  const { category_uuid, content, id } = body;
  let data = "";
  if (typeof content === "string") {
    data = content;
  } else {
    data = JSON.stringify(content);
  }
  // Query untuk menyimpan data kategori baru
  const query = `UPDATE termconditions SET content='${data}', category_uuid='${category_uuid}' WHERE id='${id}'`;
  return db.execute(query);
};

const deleteTermCondition = async (id) => {
  const deleteQuery = "DELETE FROM termconditions WHERE id = ?";
  const result = await db.execute(deleteQuery, [id]);
  return result;
};

module.exports = {
  getTermCondition,
  insertTermCondition,
  updateTermCondition,
  deleteTermCondition,
};
