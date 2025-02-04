const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { createUser, getUser } = require("../services/services");
const { activate, logoutUser, refreshFunc, getUserInfo, loadAdUser } = require("../services/user-service");
const { getProfileUsers } = require("../services/profile-view");
const AdService = require("../services/upload-service");


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
    const parts = [];
    const adData = {}; // Объект для хранения полей формы
    let uploadedFileData = null; // Информация о сохранённом файле
    const accessToken = req.headers.authorization;

    for await (const part of req.parts()) {
      if (part.file) {
        // Генерируем уникальный ID
        const uniqueId = uuidv4();

        // Получаем расширение файла
        const ext = path.extname(part.filename);

        // Формируем уникальное имя файла
        const uniqueFileName = `${uniqueId}${ext}`;
        const uploadDir = path.join(__dirname, '../uploads');

        // Создаём директорию, если её нет
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir);
        }

        const filePath = path.join(uploadDir, uniqueFileName);
        const writeStream = fs.createWriteStream(filePath);

        await part.file.pipe(writeStream); // Сохраняем файл
        uploadedFileData = { fileName: uniqueFileName, path: filePath };

        console.log(`File saved as: ${filePath}`);
        parts.push({ fieldname: part.fieldname, fileName: uniqueFileName });
      } else {
        // Если это текстовое поле
        console.log(`${part.fieldname}: ${part.value}`);
        adData[part.fieldname] = part.value; // Сохраняем текстовые данные
        parts.push({ fieldname: part.fieldname, value: part.value });
      }
    }

    const resultLoadAd = await AdService.saveAdData(adData, uploadedFileData.fileName, accessToken);



    // Выводим данные для отладки
    console.log('Результат сохранения объявления:', resultLoadAd);

    // Пример использования данных
    // const { title, trainingType, description, price, selectedDate } = adData;



    // console.log(`Title: ${title}`);
    // console.log(`Training Type: ${trainingType}`);
    // console.log(`Description: ${description}`);
    // console.log(`Price: ${price}`);
    // console.log(`Selected Date: ${selectedDate}`);
    // console.log(`Uploaded File Info:`, uploadedFileData);

    // Отправляем ответ
    res.status(200).send({
      message: 'Ad successfully received',
    });
  } catch (error) {
    console.error('Error processing form:', error);
    res.status(500).send({ message: 'Error processing form', error });
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