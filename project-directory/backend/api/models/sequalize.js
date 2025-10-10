const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
});

const RoleRequest = sequelize.define(
  "RoleRequest",
  {
    request_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    moderatorComment: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "RoleRequests",
    timestamps: true,
    updatedAt: "updatedAt",
    createdAt: "createdAt",
  }
);

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
    role: {
      type: DataTypes.ENUM("client", "coach"),
      allowNull: false,
      defaultValue: "client",
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

const TokenSchema = sequelize.define(
  "TokenSchema",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    refreshToken: { type: DataTypes.STRING, allowNull: false },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Users, key: "id" },
    },
  },
  { timestamps: true }
);

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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Users, key: "id" },
    },
  },
  { timestamps: true }
);

const Response = sequelize.define(
  "Response",
  {
    response_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    adId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: adUsers, key: "ad_id" },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Users, key: "id" },
    },
    date: { type: DataTypes.DATE, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.ENUM("new", "viewed", "accepted", "rejected"),
      defaultValue: "new",
    },
  },
  { timestamps: true }
);

const Visit = sequelize.define(
  "Visit",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    visitedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "visited_at",
    },
  },
  {
    tableName: "Visits",
    timestamps: false,
  }
);



Visit.belongsTo(Users, { foreignKey: "userId", as: "user" });

Users.hasMany(adUsers, {
  foreignKey: "userId",
  as: "ads",
  onDelete: "CASCADE",
});
adUsers.belongsTo(Users, { foreignKey: "userId", as: "user" });

adUsers.hasMany(Response, {
  foreignKey: "adId",
  as: "responses",
  onDelete: "CASCADE",
});
Response.belongsTo(adUsers, { foreignKey: "adId", as: "ad" });

Users.hasMany(Response, {
  foreignKey: "userId",
  as: "responsesByUser",
  onDelete: "CASCADE",
});
Response.belongsTo(Users, { foreignKey: "userId", as: "user" });

RoleRequest.belongsTo(Users, { foreignKey: "userId", as: "user" });

(async () => {
  try {
    const forceBD = false;
    await Users.sync({ force: forceBD });
    await TokenSchema.sync({ force: forceBD });
    await adUsers.sync({ force: forceBD });
    await Response.sync({ force: forceBD });
    await RoleRequest.sync({ force: forceBD });
    await Visit.sync({ force: forceBD });
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
  Response,
  RoleRequest,
  Visit,
};
