const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

// Создаём подключение к базе данных
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
});

// Модель пользователя
const Users = sequelize.define(
  "Users",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    login: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
    activationLink: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    phoneNumber: { type: DataTypes.STRING, allowNull: true },
    bio: { type: DataTypes.TEXT, allowNull: true },
    avatarUrl: { type: DataTypes.STRING, allowNull: true },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Модель токенов
const TokenSchema = sequelize.define(
  "TokenSchema",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    refreshToken: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: "id" } },
  },
  { timestamps: true }
);

// Модель объявлений
const adUsers = sequelize.define(
  "adUsers",
  {
    ad_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    typeOfTrening: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    namePhoto: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    city_ad: { type: DataTypes.STRING, allowNull: false },
    moderation: { type: DataTypes.BOOLEAN, defaultValue: false },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: "id" } },
  },
  { timestamps: true }
);

// Модель откликов
const Response = sequelize.define(
  "Response",
  {
    response_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    adId: { type: DataTypes.INTEGER, allowNull: false, references: { model: adUsers, key: 'ad_id' } },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
    date: { type: DataTypes.DATE, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM('new', 'viewed', 'accepted', 'rejected'), defaultValue: 'new' },
  },
  { timestamps: true }
);

// Ассоциации
Users.hasMany(adUsers, { foreignKey: 'userId', as: 'ads', onDelete: 'CASCADE' });
adUsers.belongsTo(Users, { foreignKey: 'userId', as: 'user' });

adUsers.hasMany(Response, { foreignKey: 'adId', as: 'responses', onDelete: 'CASCADE' });
Response.belongsTo(adUsers, { foreignKey: 'adId', as: 'ad' });

Users.hasMany(Response, { foreignKey: 'userId', as: 'responsesByUser', onDelete: 'CASCADE' });
Response.belongsTo(Users, { foreignKey: 'userId', as: 'user' });

// Синхронизация и проверка соединения
(async () => {
  try {
    const forceBD = false;
    await Users.sync({ force: forceBD });
    await TokenSchema.sync({ force: forceBD });
    await adUsers.sync({ force: forceBD });
    await Response.sync({ force: forceBD });
    await sequelize.authenticate();
    console.log("Соединение с БД было успешно установлено");
  } catch (e) {
    console.log("Невозможно выполнить подключение к БД: ", e);
    process.exit(1);
  }
})();

module.exports = {
  sequelize,
  Users,
  TokenSchema,
  adUsers,
  Response
};
