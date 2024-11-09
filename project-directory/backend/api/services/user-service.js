const { Users } = require("../models/sequalize");
const { removeToken, validateRefreshToken, tokenService } = require("./token-service");
const UserDto = require("../dtos/user-dto");
const { RefreshTokenError, InternalServerError, NotFoundUser } = require("../middleware/error-handler");

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
    const existingUser = await Users.findOne({ where: { id: id } });
    if (!existingUser) {
      throw new NotFoundUser("User not found");
    }
    const userDto = new UserDto(existingUser);
    return userDto;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

const loadAdUser = async () => {
  try {
    // Вызов функции сохранения фотографии.

    // Если Сохранение прошло успешно, тогда сохранём объявление в базу данных.

    // Результат true и тогда выводим сообщение пользователю о том, что объявление на рассмотрении.
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = { activate, logoutUser, refreshFunc, getUserInfo, loadAdUser };
