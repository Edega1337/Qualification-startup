const { jwtDecode } = require('jwt-decode');
const { adUsers } = require('../models/sequalize');

class AdService {
  async saveAdData(adData, namePhoto, accessToken) {
    try {
      const { title, trainingType, description, price, selectedDate } = adData;
      const { id } = jwtDecode(accessToken);

      await adUsers.create({
        name: title,
        typeOfTrening: trainingType,
        description: description,
        namePhoto: namePhoto,
        price: price,
        date: selectedDate,
        moderation: false,
        userId: id,
      });

      return { success: true };
    } catch (error) {
      console.error('Ошибка при сохранении данных объявления:', error);
      return { success: false, error };
    }
  };
  
}

module.exports = new AdService();

