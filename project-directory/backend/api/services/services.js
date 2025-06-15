const bcrypt = require("bcryptjs");
const { Users } = require("../models/sequalize");
const { Op } = require('sequelize');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { mailService } = require('./mail-service');
const { tokenService, saveToken } = require("./token-service");
const { AuthorizationError, BadRequestError, VerifyError, errorRegistration } = require("../middleware/error-handler");
const UserDto = require("../dtos/user-dto");
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const getUser = async (body) => {
  const { login, password } = body;

  const existingUser = await Users.findOne({ where: { login } });

  if (!existingUser) {
    throw new AuthorizationError('Неправильный логин или пароль');
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid) {
    throw new AuthorizationError('Неправильный логин или пароль');
  };

  const userDto = new UserDto(existingUser);

  if (!userDto.isActivated) {
    throw new VerifyError('Почта не прошла верификацию, активируйте свой профиль перейдя по ссылке отправленной вам на почту');
  }

  const tokens = await tokenService(userDto.toPayload());

  await saveToken(userDto.toJSON().id, tokens.refreshToken);

  return {
    status: 200,
    data: {
      ...tokens
    }
  };
}

const createUser = async (body) => {
  try {
    const {
      email,
      login,
      password,
      name,
      city,
      phoneNumber,
      bio,
      role = 'client',
    } = body;

    const existingUser = await Users.findOne({
      where: { [Op.or]: [{ email }, { login }] },
    });
    if (existingUser) {
      const conflictField = existingUser.email === email ? 'email' : 'login';
      const error = new Error(`Пользователь с таким ${conflictField} уже существует`);
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const activationLink = uuidv4();

    const newUser = await Users.create({
      email,
      login,
      password: hashedPassword,
      activationLink,
      name,
      city,
      phoneNumber,
      bio,
      role,
    });

    await mailService(email, `${process.env.API_URL}/activate/${activationLink}`);

    const userDto = new UserDto(newUser);
    const tokens = await tokenService(userDto.toPayload());
    await saveToken(userDto.id, tokens.refreshToken);

    return { status: 201, data: { ...tokens } };
  } catch (err) {
    console.error("Ошибка при создании пользователя:", err);
    throw err;
  }
};



module.exports = { getUser, createUser };
