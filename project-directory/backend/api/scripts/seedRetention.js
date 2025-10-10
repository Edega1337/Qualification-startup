const path = require('path');
const { Sequelize, DataTypes, Op } = require('sequelize');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);


const { Users } = require('../models/sequalize');


const Visit = sequelize.define('Visit', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  visited_at: { type: DataTypes.DATE, allowNull: false },
}, {
  tableName: 'Visits',
  timestamps: false,
});

async function seedRetention() {
  const days = parseInt(process.argv[2], 10) || 7;  // по умолчанию 7-дней
  console.log(`🛠️  Сидим  ${days}-дневный ретеншн...`);

  await sequelize.authenticate();


  const users = await Users.findAll({
    where: {
      created_at: { [Op.gte]: Sequelize.literal(`now() - interval '30 days'`) }
    },
    attributes: ['id', 'created_at'],
    raw: true,
  });


  const visits = users.map(u => ({
    userId: u.id,
    visited_at: new Date(new Date(u.created_at).getTime() + days * 24 * 3600 * 1000)
  }));


  await Visit.bulkCreate(visits, { ignoreDuplicates: true });

  console.log(`✅ Создано визитов: ${visits.length}`);
  process.exit(0);
}

seedRetention().catch(err => {
  console.error(err);
  process.exit(1);
});
