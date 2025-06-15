// api/services/response-service.js
// Исправленный сервис для работы с откликами

const { Response, adUsers, Users } = require('../models/sequalize');
const { NotFoundError } = require('../middleware/error-handler');

class ResponseService {
  /**
   * Отклики, которые пользователь оставил на объявления
   */
  async getMyResponses(userId) {
    return await Response.findAll({
      where: { userId },
      include: [
        { model: adUsers, as: 'ad', attributes: ['ad_id', 'name', 'typeOfTrening', 'namePhoto'] }
      ],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
    });
  }

  /**
   * Отклики на объявления тренера
   */
  async getOwnerResponses(userId) {
    return await Response.findAll({
      include: [
        {
          model: adUsers,
          as: 'ad',
          where: { userId },            // adUsers.userId = coach id
          attributes: ['ad_id', 'name', 'typeOfTrening', 'namePhoto'],
        },
        {
          model: Users,
          as: 'user',
          attributes: ['id', 'login', 'avatarUrl'],
        },
      ],
      order: [['createdAt', 'DESC']],  // use Sequelize default createdAt field
      raw: true,
      nest: true,
    });
  }

  /**
   * Принять отклик
   */
  async acceptResponse(responseId) {
    const resp = await Response.findByPk(responseId);
    if (!resp) throw new NotFoundError('Response not found');
    resp.status = 'accepted';
    await resp.save();
    return resp;
  }

  /**
   * Отклонить отклик
   */
  async rejectResponse(responseId, comment) {
    const resp = await Response.findByPk(responseId);
    if (!resp) throw new NotFoundError('Response not found');
    resp.status = 'rejected';
    if (comment) resp.comment = comment;
    await resp.save();
    return resp;
  }
}

module.exports = new ResponseService();
