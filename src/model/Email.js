const db = require("../config/connectDb");

const getMail = async (body, page, pageSize) => {
  let sqlQuery = "SELECT * FROM email WHERE 1";
  const params = [];

  if (body.id) {
    sqlQuery += " AND id = ?";
    params.push(body.id);
  }

  if (body.email) {
    sqlQuery += " AND email = ?";
    params.push(body.email);
  }

  if (body.name) {
    sqlQuery += " AND name LIKE ?";
    params.push(`%${body.name}%`);
  }

  sqlQuery += " GROUP BY id";

  if (page && pageSize) {
    const offset = (page - 1) * pageSize;
    sqlQuery += " LIMIT ?, ?";
    params.push(`${offset}`, `${pageSize}`);
  }

  let countQuery = `
      SELECT COUNT(*) AS total_data
      FROM email
      WHERE 1
    `;

  let paramsCount = [];

  if (body.id) {
    countQuery += " AND id = ?";
    paramsCount.push(body.id);
  }

  if (body.email) {
    countQuery += " AND email = ?";
    paramsCount.push(body.email);
  }

  if (body.name) {
    countQuery += " AND name LIKE ?";
    paramsCount.push(`%${body.name}%`);
  }

  const emails = await db.execute(sqlQuery, params);
  const respCount = await db.execute(countQuery, paramsCount);

  return {
    pagination: respCount,
    data: emails,
  };
};

const insert = async (body) => {
  const { email, name, message } = body;
  const query = "INSERT INTO email (name, email, message) VALUES (?, ?, ?)";
  const values = [name, email, message];

  return db.execute(query, values);
};

module.exports = { getMail, insert };
