// backend/api/scripts/seedVisits.js
// Скрипт для сидирования Visits на последние 6 месяцев (≈180 дней) с улучшенным разбросом MAU
const { sequelize, Users, Visit } = require('../models/sequalize');

async function seed() {
  await sequelize.authenticate();

  // 1) Создаем/обновляем таблицу Visits и очищаем её
  await Visit.sync();
  await Visit.destroy({ truncate: true, cascade: true });

  // 2) Получаем существующие userId
  const users = await Users.findAll({ attributes: ['id'] });
  const userIds = users.map(u => u.id);
  if (!userIds.length) {
    console.warn('Нет пользователей для генерации визитов');
    process.exit(0);
  }

  const daysToGenerate = 180;
  const now = new Date();

  // 3) Генерация визитов для реальных пользователей с расширенным разбросом
  for (let d = 0; d < daysToGenerate; d++) {
    const baseDate = new Date(now);
    baseDate.setDate(now.getDate() - d);

    // Случайное число уникальных посетителей в день: 5..N + up to 15 для увеличения разброса
    const baseCount = Math.floor(Math.random() * (userIds.length - 5)) + 5;
    const extra = Math.floor(Math.random() * 15); // добавочный разброс
    const uniqueCount = Math.min(userIds.length, baseCount + extra);

    // Выбираем случайных пользователей
    const todays = shuffle([...userIds]).slice(0, uniqueCount);

    for (const uid of todays) {
      const visitsCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < visitsCount; i++) {
        await Visit.create({ userId: uid, visitedAt: randomTime(baseDate) });
      }
    }
  }

  // 4) Создание ghost-пользователей и их визитов (не влияют на MAU реальных)
  const maxUserId = Math.max(...userIds);
  const ghostIds = Array.from({ length: 10 }, (_, i) => maxUserId + 1 + i);
  const ghostUsers = ghostIds.map(id => ({
    id, email: `ghost${id}@example.com`, login: `ghost${id}`, password: 'ghost', activationLink: '', role: 'client',
  }));
  await Users.bulkCreate(ghostUsers, { ignoreDuplicates: true });

  for (let d = 0; d < daysToGenerate; d++) {
    const baseDate = new Date(now);
    baseDate.setDate(now.getDate() - d);
    ghostIds.forEach(async gid => {
      const cnt = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < cnt; i++) {
        await Visit.create({ userId: gid, visitedAt: randomTime(baseDate) });
      }
    });
  }

  console.log('✅ Сидирование Visits на 6 месяцев выполнено с увеличенным разбросом');
  process.exit(0);
}

// Fisher–Yates shuffle
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Функция для случайного времени в пределах дня
function randomTime(baseDate) {
  const dt = new Date(baseDate);
  dt.setHours(Math.floor(Math.random() * 24));
  dt.setMinutes(Math.floor(Math.random() * 60));
  dt.setSeconds(Math.floor(Math.random() * 60));
  return dt;
}

seed().catch(err => {
  console.error('Ошибка при сидировании Visits:', err);
  process.exit(1);
});
