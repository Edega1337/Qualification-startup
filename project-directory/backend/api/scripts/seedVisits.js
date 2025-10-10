// Скрипт для сидирования таблицы Visits включительно с несуществующими пользователями
const { sequelize, Users, Visit } = require('../models/sequalize');

async function seed() {
  await sequelize.authenticate();

  // 1) Убедимся, что таблица Visits существует
  await Visit.sync();

  // 2) Очистим старые визиты
  await Visit.destroy({ truncate: true, cascade: true });

  // 3) Получаем существующие userId
  const users = await Users.findAll({ attributes: ['id'] });
  const userIds = users.map(u => u.id);
  if (userIds.length === 0) {
    console.warn('Нет пользователей для генерации визитов');
    process.exit(0);
  }

  const daysDAU = 30;
  const now = new Date();


  for (let d = 0; d < daysDAU; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() - d);

    const uniqueCount = Math.min(
      userIds.length,
      Math.floor(Math.random() * (userIds.length - 5)) + 5
    );
    const shuffled = shuffle([...userIds]);
    const todays = shuffled.slice(0, uniqueCount);

    for (const uid of todays) {
      const cnt = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < cnt; i++) {
        const ts = randomTime(date);
        await Visit.create({ userId: uid, visitedAt: ts });
      }
    }
  }


  await sequelize.query("SET session_replication_role = 'replica';");

  const maxUser = Math.max(...userIds);
  const ghostIds = Array.from({ length: 10 }, (_, i) => maxUser + 1 + i);

  for (let d = 0; d < daysDAU; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() - d);
    const ghostCount = 3; // по 3 «призрачных» визита в день
    for (let i = 0; i < ghostCount; i++) {
      const randomGhost = ghostIds[Math.floor(Math.random() * ghostIds.length)];
      const ts = randomTime(date);
      // вставляем напрямую в БД, без моделей, чтобы обойти FK
      await sequelize.query(
        `INSERT INTO "Visits" ("userId", "visited_at") VALUES (${randomGhost}, '${ts.toISOString()}')`
      );
    }
  }

  // Включаем проверку FK-триггеров обратно
  await sequelize.query("SET session_replication_role = 'origin';");

  console.log('✅ Сидирование Visits (реальных и призрачных) выполнено');
  process.exit(0);
}

// Вспомогательные функции
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function randomTime(baseDate) {
  const ts = new Date(baseDate);
  ts.setHours(Math.floor(Math.random() * 24));
  ts.setMinutes(Math.floor(Math.random() * 60));
  ts.setSeconds(Math.floor(Math.random() * 60));
  return ts;
}

seed().catch(err => {
  console.error('Ошибка при сидировании Visits:', err);
  process.exit(1);
});