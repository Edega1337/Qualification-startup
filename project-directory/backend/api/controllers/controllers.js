const { createUser, getUser } = require("../services/services");
const { activate, logoutUser, refreshFunc, getUserInfo, loadAdUser } = require("../services/user-service");
const { getProfileUsers } = require("../services/profile-view");
const AdService = require("../services/upload-service");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const handleErrorResponse = (res, error, defaultStatus = "No name error") => {
  res.status(error.status || defaultStatus).send(error);
};

const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
    httpOnly: true,
  });
};

const registerUser = async (req, res) => {
  try {
    const { data } = await createUser(req.body);
    setRefreshTokenCookie(res, data.refreshToken);
    res.status(201).send({ accessToken: data.accessToken });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const authUser = async (req, res) => {
  try {
    const { data } = await getUser(req.body);
    setRefreshTokenCookie(res, data.refreshToken);
    res.status(200).send({ accessToken: data.accessToken });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    await logoutUser(refreshToken);
    res.clearCookie("refreshToken");
    res.status(200).send({ message: "Logout successful" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const activateUser = async (req, res) => {
  try {
    const activationLink = req.params.link;
    await activate(activationLink);
    res.redirect(process.env.CLIENT_URL);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    const resultAccessToken = await refreshFunc(refreshToken);
    res.status(200).send(resultAccessToken);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const currentUser = async (req, res) => {
  try {
    const { id } = req.user;
    const resultSearch = await getUserInfo(id);
    res.status(200).send(resultSearch);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const profileUsers = async (req, res) => {
  try {
    const login = req.params.login;
    const resultSearchUsers = await getProfileUsers(login);
    res.status(200).send(resultSearchUsers);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

const loadAd = async (req, res) => {
  try {
    // Получаем данные из тела запроса
    const accessToken = req.headers.authorization;
    const adData = req.body;
    console.log("результат получения данных", accessToken);
    // Вызов сервиса для обработки данных объявления
    const result = await AdService.saveAdData(adData, accessToken);
    console.log("результат отправки", result);
    // Если сохранение прошло успешно, отправляем ответ
    if (result.success) {
      res.send({ success: true, message: 'Объявление успешно загружено и находится на рассмотрении.' });
    } else {
      res.status(500).send({ success: false, message: 'Ошибка при сохранении объявления' });
    }
  } catch (error) {
    handleErrorResponse(res, error);
  }
};


module.exports = {
  registerUser,
  authUser,
  logout,
  activateUser,
  refresh,
  currentUser,
  profileUsers,
  loadAd
};