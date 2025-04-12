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

module.exports = { activate, logoutUser, refreshFunc, getUserInfo, updateUserProfile };
