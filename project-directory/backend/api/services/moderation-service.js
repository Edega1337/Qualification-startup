// api/services/moderation-service.js
// Сервис «Модерация»: управление заявками на повышение роли до `coach`.
// Здесь сосредоточена ВЕСЬ бизнес‑логика, контроллеры — только thin wrappers.

const { RoleRequest, Users } = require('../models/sequalize');
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require('../middleware/error-handler');

class ModerationService {
  /**
 * Создать заявку «Стать тренером».
 * @param {number} userId – ID автора заявки (клиент)
 * @returns {Promise<RoleRequest>}
 */
  async submitRoleRequest(userId) {
    const { role } = await Users.findByPk(userId);
    if (!role) throw new NotFoundError('User not found');
    if (role === 'coach') {
      throw new BadRequestError('You are already a coach');
    }

    const pending = await RoleRequest.findOne({ where: { userId, status: 'pending' } });
    if (pending) {
      throw new BadRequestError('There is already a pending request');
    }

    const request = await RoleRequest.create({ userId, status: 'pending' });
    return request;
  };

  /**
   * Список всех заявок (для модератора).
   * newest first, вместе с данными пользователя (login, email).
   */

  async listRoleRequests() {
    return RoleRequest.findAll({
      include: [
        {
          model: Users,
          as: 'user',
          attributes: ['id', 'login', 'email', 'role'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  };

  /**
   * Обработать заявку: approve / reject.
   * @param {number} requestId
   * @param {'approve'|'reject'} action
   * @returns {Promise<RoleRequest>}
   */
  async updateRoleRequest(requestId, action) {
    if (!['approve', 'reject'].includes(action)) {
      throw new BadRequestError('Invalid action');
    }

    const request = await RoleRequest.findByPk(requestId);
    if (!request) throw new NotFoundError('Request not found');
    if (request.status !== 'pending') {
      throw new BadRequestError('Request already processed');
    }

    if (action === 'approve') {
      const user = await Users.findByPk(request.userId);
      if (!user) throw new NotFoundError('User not found');
      if (user.role === 'coach') {
        throw new BadRequestError('User is already a coach');
      }
      user.role = 'coach';
      await user.save();
      request.status = 'approved';
    } else {
      request.status = 'rejected';
    }
    await request.save();
    return request;
  };

}



module.exports = new ModerationService();