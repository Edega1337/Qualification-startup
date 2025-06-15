const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { createUser, getUser } = require("../services/services.js");
const { activate, logoutUser, refreshFunc, getUserInfo, loadAdUser, deleteAdService, updateUserProfile, getResponsesForOwner } = require("../services/user-service");
const { searchAds } = require("../services/search-service.js")
const { getProfileUsers } = require("../services/profile-view");
const { getAdDetail, respondToAd, listResponses } = require("../services/ad-service.js")
const ResponseService = require("../services/response-service.js");
const ModerationService = require('../services/moderation-service');
const AdService = require("../services/upload-service");


const handleErrorResponse = (res, error) => {
  const statusCode = error.statusCode || error.status || 500;
  const message = error.message || 'Внутренняя ошибка сервера';

  res.status(statusCode).send({ message });
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
    console.error("Ошибка в контроллере регистрации:", error);
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


const editProfileUser = async (req, res) => {
  try {
    const newProfileData = {};
    let avatarReceived = false;

    for await (const part of req.parts()) {
      if (part.file) {
        // Файл — неважно как называется поле
        avatarReceived = true;
        console.log("📸 Файл получен:", part.fieldname, part.filename);

        const uniqueId = uuidv4();
        const ext = path.extname(part.filename);
        const uniqueFileName = `${uniqueId}${ext}`;
        const uploadDir = path.join(__dirname, "../uploads", "avatars");

        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, uniqueFileName);
        const writeStream = fs.createWriteStream(filePath);

        await part.file.pipe(writeStream);

        // 📌 ВАЖНО: сохраняем путь как avatarUrl — КОНКРЕТНО ЭТО ПОЛЕ
        newProfileData.avatarUrl = `/uploads/avatars/${uniqueFileName}`;
      } else {
        // обычное текстовое поле
        newProfileData[part.fieldname] = part.value;
      }
    }

    if (!avatarReceived) {
      console.log("⚠️ Файл не был передан");
    }

    console.log("📥 Собранные данные перед обновлением:", newProfileData);

    const updatedProfile = await updateUserProfile(req.user.id, newProfileData);

    res.status(200).send({
      message: "Профиль успешно обновлён",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("❌ Ошибка при обновлении профиля:", error);
    res.status(500).send({ message: "Ошибка при редактировании профиля", error });
  }
};



const deleteAdController = async (req, res) => {
  try {
    const adId = req.params.id;
    const userId = req.user.id;

    const result = await deleteAdService(userId, adId);

    res.status(200).json({
      message: "Объявление успешно удалено",
      result,
    });
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
    console.log("adData, проверка что мы там отправляем", adData);
    const resultLoadAd = await AdService.saveAdData(adData, uploadedFileData.fileName, accessToken);

    // Выводим данные для отладки
    console.log('Результат сохранения объявления:', resultLoadAd);

    // Отправляем ответ
    res.status(200).send({
      message: 'Ad successfully received',
    });
  } catch (error) {
    console.error('Error processing form:', error);
    res.status(500).send({ message: 'Error processing form', error });
  }
};

const searchAd = async (req, res) => {
  try {
    const ads = await searchAds(req.query);
    console.log("Результат поиска:", ads);
    res.send(ads);
  } catch (error) {
    console.error("Ошибка при поиске объявлений:", error);
    res.status(500).send({ error: "Ошибка при поиске объявлений" });
  }
};

const getAd = async (req, res) => {
  try {
    const ad = await getAdDetail(req.params.id);
    res.send(ad);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

// Отклик на объявление
const postResponse = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send({ message: 'Нужно авторизоваться' });
    }
    const newResp = await respondToAd(
      req.params.id,
      req.user.id,
      { date: req.body.date, message: req.body.message }
    );
    res.send(newResp);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

// Список откликов (для владельца)
const getResponses = async (req, res) => {
  try {
    if (!req.user) return res.status(401).send({ message: 'Нужно авторизоваться' });
    const list = await listResponses(req.params.id, req.user.id);
    res.send(list);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

const userResponsesHandler = async (req, res) => {
  try {
    const responses = req.user.role === 'coach'
      ? await ResponseService.getOwnerResponses(req.user.id)
      : await ResponseService.getMyResponses(req.user.id);
    res.send({ responses });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

const submitRoleRequest = async (req, res) => {
  try {
    const result = await ModerationService.submitRoleRequest(req.user.id);
    console.log(result);
    res.status(201).json(result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

const listRoleRequests = async (req, res) => {
  try {
    const requests = await ModerationService.listRoleRequests();
    const plain = requests.map(r => r.toJSON());
    res.send(plain);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

const updateRoleRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const updated = await ModerationService.updateRoleRequest(id, action);
    res.json(updated);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

/**
 * GET /responses/my
 * Список откликов, которые текущий пользователь оставил
 */

const getMyResponsesHandler = async (req, res) => {
  try {
    const responses = await ResponseService.getMyResponses(req.user.id);
    res.send({ responses });
  } catch (err) {
    handleErrorResponse(res, err);
  }
}

/**
 * PATCH /responses/:id/accept
 * Тренер принимает отклик
 */

const acceptResponseHandler = async (req, res) => {
  try {
    const responseObj = await ResponseService.acceptResponse(req.params.id);
    res.send(responseObj);
  } catch (err) {
    handleErrorResponse(res, err);
  }
}

/**
 * PATCH /responses/:id/reject
 * Тренер отклоняет отклик, необязательный комментарий в теле
 */

const rejectResponseHandler = async (req, res) => {
  try {
    const { comment } = req.body;
    const responseObj = await ResponseService.rejectResponse(req.params.id, comment);
    res.send(responseObj);
  } catch (err) {
    handleErrorResponse(res, err);
  }
}



module.exports = {
  registerUser,
  authUser,
  logout,
  activateUser,
  refresh,
  currentUser,
  profileUsers,
  loadAd,
  editProfileUser,
  deleteAdController,
  searchAd,
  getAd,
  postResponse,
  getResponses,
  userResponsesHandler,
  submitRoleRequest,
  listRoleRequests,
  updateRoleRequest,
  getMyResponsesHandler,
  acceptResponseHandler,
  rejectResponseHandler
};

