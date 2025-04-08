const { Sequelize, DataTypes, BOOLEAN } = require("sequelize");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

// Создаём подключение к базе данных
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
});

// const Users = sequelize.define(
//   "Users",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     login: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     nameUser: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     isActivated: {
//       type: BOOLEAN,
//       defaultValue: false,
//     },
//     activationLink: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     reviews: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       defaultValue: 0,
//     },
//     photoUser: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     rating: {
//       type: DataTypes.FLOAT,
//       allowNull: true,
//       defaultValue: 0,
//     },
//   },
//   {
//     timestamps: true,
//     createdAt: "created_at",
//     updatedAt: "updated_at",
//   }
// );

const Users = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActivated: {
      type: BOOLEAN,
      defaultValue: false,
    },
    activationLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Модель TokenSchema
const TokenSchema = sequelize.define(
  "TokenSchema",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Users,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Модель хранения объявлений
const adUsers = sequelize.define(
  "adUsers",
  {
    ad_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    typeOfTrening: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    namePhoto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    moderation: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Users,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Определяем ассоциации с алиасами
Users.hasMany(adUsers, { foreignKey: 'userId', as: 'ads', onDelete: 'CASCADE' }); // Добавлено onDelete
adUsers.belongsTo(Users, { foreignKey: 'userId', as: 'user' });

(async () => {
  try {
    const forceBD = false;
    await Users.sync({ force: forceBD });
    await TokenSchema.sync({ force: forceBD });
    await adUsers.sync({ force: forceBD });
    await sequelize.authenticate();
    console.log("Соединение с БД было успешно установлено");
  } catch (e) {
    console.log("Невозможно выполнить подключение к БД: ", e);
    return 1;
  }
})();

module.exports = {
  sequelize,
  Users,
  TokenSchema,
  adUsers,
};