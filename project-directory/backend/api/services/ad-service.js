const { adUsers, Response } = require("../models/sequalize");


const getAdDetail = async (adId) => {
  const ad = await adUsers.findByPk(adId, { raw: true });
  if (!ad) {
    const err = new Error('Объявление не найдено');
    err.status = 404;
    throw err;
  }
  return ad;
}


const respondToAd = async (adId, userId, { date, message }) => {

  const ad = await adUsers.findByPk(adId);
  if (!ad) {
    const err = new Error('Объявление не найдено');
    err.status = 404;
    throw err;
  }

  if (new Date(date).getTime() !== new Date(ad.date).setMilliseconds(0)) {
    const err = new Error('Неверная дата отклика');
    err.status = 400;
    throw err;
  }

  const exists = await Response.findOne({ where: { adId, userId } });
  if (exists) {
    const err = new Error('Вы уже откликались на это объявление');
    err.status = 409;
    throw err;
  }

  const resp = await Response.create({ adId, userId, date, message });
  return resp.get({ plain: true });
}

const listResponses = async (adId, ownerId) => {
  const ad = await adUsers.findByPk(adId);
  if (!ad) throw Object.assign(new Error('Объявление не найдено'), { status: 404 });
  if (ad.userId !== ownerId) {
    throw Object.assign(new Error('Доступ запрещён'), { status: 403 });
  }
  return Response.findAll({
    where: { adId },
    include: [{ model: adUsers, as: 'ad' }, { model: adUsers.sequelize.models.Users, as: 'user', attributes: ['id', 'name', 'avatarUrl'] }],
    order: [['createdAt', 'DESC']],
    raw: false,
  });
}

module.exports = { getAdDetail, respondToAd, listResponses };

