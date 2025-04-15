const { Users, adUsers } = require("../models/sequalize");
const {
  removeToken,
  validateRefreshToken,
  tokenService,
} = require("./token-service");
const UserDto = require("../dtos/user-dto");
const {
  RefreshTokenError,
  InternalServerError,
  NotFoundUser,
  NotFoundAd,
  ForbiddenError
} = require("../middleware/error-handler");

const activate = async (activationLink) => {
  try {
    const user = await Users.findOne({
      where: {
        activationLink: activationLink,
      },
    });
    user.isActivated = true;
    await user.save();
  } catch (error) {
    console.log(error);
    throw new InternalServerError("INTERNAL_SERVER_ERROR");
  }
};

const logoutUser = async (refreshToken) => {
  try {
    const token = await removeToken(refreshToken);
    return token;
  } catch (error) {
    throw new InternalServerError("INTERNAL_SERVER_ERROR");
  }
};

const refreshFunc = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw new RefreshTokenError("Refresh token unavailable");
    }
    const userData = await validateRefreshToken(refreshToken);

    if (!userData) {
      throw new RefreshTokenError("Refresh token expired");
    }

    const existingUser = await Users.findOne({ where: { id: userData.id } });
    const userDto = new UserDto(existingUser);
    const newAccessToken = await tokenService(userDto.toJSON());

    return {
      accessToken: newAccessToken.accessToken,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getUserInfo = async (id) => {
  try {
    const existingUser = await Users.findOne({
      where: { id: id },
      include: [{
        model: adUsers,
        as: 'ads',
      }]
    });

    if (!existingUser) {
      throw new NotFoundUser("User not found");
    }

    const userDto = new UserDto(existingUser);
    return userDto.toJSON(); // Возвращаем данные в формате JSON
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const updateUserProfile = async (userId, newProfileData) => {
  try {
    const user = await Users.findByPk(userId);
    console.log("Полученные данные для обновления:", newProfileData);
    if (!user) {
      throw new NotFoundUser("User not found");
    }

    // Итерируем по ключам и присваиваем значение из свойства .value, если оно есть
    Object.keys(newProfileData).forEach((key) => {
      const field = newProfileData[key];
      if (field && typeof field === 'object' && field.value !== undefined) {
        user[key] = field.value;
      } else if (field !== undefined) {
        user[key] = field;
      }
    });

    // Сохраняем изменения
    await user.save();

    const userDto = new UserDto(user);
    return userDto.toJSON();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const deleteAdService = async (userId, adId) => {
  /**
 * Удаляет объявление, если оно принадлежит пользователю с userId.
 * @param {number|string} userId - Идентификатор текущего пользователя из req.user.
 * @param {number|string} adId - Идентификатор объявления, которое требуется удалить.
 * @returns {Promise<object>} - Объект с результатом (например, { adId }).
 * @throws {NotFoundError} - Если объявление не найдено.
 * @throws {ForbiddenError} - Если пользователь не является владельцем объявления.
 */
  // Находим объявление по его первичному ключу
  const ad = await adUsers.findByPk(adId);
  if (!ad) {
    throw new NotFoundAd("Объявление не найдено");
  }

  // Проверяем, является ли текущий пользователь владельцем объявления
  if (ad.userId !== userId) {
    throw new ForbiddenError("Вы не можете удалить чужое объявление");
  }

  // Если проверка пройдена, удаляем объявление
  await ad.destroy();

  return { adId };

};

module.exports = { activate, logoutUser, refreshFunc, getUserInfo, updateUserProfile, deleteAdService };
