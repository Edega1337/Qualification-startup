const jwt = require("jsonwebtoken");
const path = require("path");
const { TokenSchema } = require("../models/sequalize");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

/**
 * @param {object} payload — минимум { id, login, role }
 * @returns {{ accessToken: string, refreshToken: string }}
 */

const tokenService = async (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "20m",
  });
  return {
    accessToken,
    refreshToken,
  };
};

const saveToken = async (userId, refreshToken) => {
  const tokenData = await TokenSchema.findOne({ userId });
  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }
  return TokenSchema.create({ userId, refreshToken });
};

const removeToken = async (refreshToken) => {
  const tokenData = await TokenSchema.destroy({ where: { refreshToken } });
  return tokenData === 1 ? refreshToken : null;
};

const validateAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch {
    return null;
  }
};

const validateRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    return null;
  }
};

const findToken = (refreshToken) => TokenSchema.findOne({ refreshToken });

module.exports = {
  tokenService,
  saveToken,
  removeToken,
  validateAccessToken,
  validateRefreshToken,
  findToken,
};
