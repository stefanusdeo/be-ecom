const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserModel = require("../model/User");

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const secretKey = process.env.KEY_TOKEN;
    const payloadUser = {
      username,
    };
    const [rows] = await UserModel.getUsers(payloadUser);

    if (rows.length > 0) {
      const user = rows[0];
      const hashedPassword = rows[0].password;
      const passwordMatch = await bcrypt.compare(password, hashedPassword);
      if (passwordMatch) {
        const accessToken = jwt.sign(
          { userId: user.id, uuid: user.uuid },
          secretKey,
          { expiresIn: "3h" }
        );
        return res.json({
          success: true,
          message: "Login successful",
          user: user,
          accessToken,
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password 1",
          data: rows,
        });
      }
    } else {
      // User not found, send error response
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password 11" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
};
