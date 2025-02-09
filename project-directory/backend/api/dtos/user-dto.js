const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

class UserDto {
  id;
  email;
  login;
  isActivated;
  ads; // Добавляем поле для объявлений

  constructor(model) {
    this.id = model.id;
    this.email = model.email;
    this.login = model.login;
    this.isActivated = model.isActivated;

    // Добавляем данные объявлений, если они есть
    if (model.ads) {
      this.ads = model.ads.map(ad => ({
        id: ad.ad_id,
        name: ad.name,
        typeOfTrening: ad.typeOfTrening,
        description: ad.description,
        price: ad.price,
        date: ad.date,
        moderation: ad.moderation,
        photo: ad.namePhoto ? `${process.env.API_URL + "/uploads/"}${ad.namePhoto}` : null, // Добавляем URL к фото
      }));
    } else {
      this.ads = []; // Если объявлений нет, возвращаем пустой массив
    }
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      login: this.login,
      isActivated: this.isActivated,
      ads: this.ads, // Включаем объявления в JSON
    };
  }

  toPayload() {
    return {
      id: this.id,
      login: this.login,
      ads: this.ads, // Включаем объявления в payload (если нужно)
    };
  }

  toProfile() {
    return {
      id: this.id,
      login: this.login,
      ads: this.ads, // Включаем объявления в профиль
    };
  }
}

module.exports = UserDto;