const { Op } = require("sequelize");
const { adUsers } = require("../models/sequalize");

function normalizeQuery(query) {
  const normalized = {};
  for (const key in query) {
    const value = query[key];
    if (typeof value === "string") {
      normalized[key] = value.trim();
    } else {
      normalized[key] = value;
    }
  }
  return normalized;
}

async function searchAds(query) {
  const normalizedQuery = normalizeQuery(query);
  const where = {};

  // Поиск по названию (частичное совпадение, без учёта регистра)
  if (normalizedQuery.name) {
    where.name = { [Op.iLike]: `%${normalizedQuery.name}%` };
  }

  // Поиск по типу тренировки (частичное совпадение, без учёта регистра)
  if (normalizedQuery.typeOfTrening) {
    where.typeOfTrening = { [Op.iLike]: `%${normalizedQuery.typeOfTrening}%` };
  }

  // Поиск по городу
  if (normalizedQuery.city_ad) {
    where.city_ad = { [Op.iLike]: `%${normalizedQuery.city_ad}%` };
  }

  // Диапазон цены
  if (normalizedQuery.minPrice || normalizedQuery.maxPrice) {
    where.price = {};
    if (normalizedQuery.minPrice) {
      where.price[Op.gte] = parseInt(normalizedQuery.minPrice, 10);
    }
    if (normalizedQuery.maxPrice) {
      where.price[Op.lte] = parseInt(normalizedQuery.maxPrice, 10);
    }
  }

  // Диапазон дат
  if (normalizedQuery.startDate || normalizedQuery.endDate) {
    where.date = {};
    if (normalizedQuery.startDate) {
      where.date[Op.gte] = new Date(normalizedQuery.startDate);
    }
    if (normalizedQuery.endDate) {
      where.date[Op.lte] = new Date(normalizedQuery.endDate);
    }
  }

  // Флаг модерации
  if (typeof normalizedQuery.moderation !== "undefined") {
    where.moderation = normalizedQuery.moderation === "true";
  }

  // Фильтрация по userId
  if (normalizedQuery.userId) {
    where.userId = parseInt(normalizedQuery.userId, 10);
  }

  // Пагинация
  const limit = parseInt(normalizedQuery.limit, 10) || 10;
  const offset = parseInt(normalizedQuery.offset, 10) || 0;

  const ads = await adUsers.findAll({
    where,
    order: [["date", "DESC"]],
    limit,
    offset,
  });

  return ads;
}

module.exports = {
  searchAds,
};
