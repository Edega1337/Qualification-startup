const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

class UserDto {
  id;
  email;
  login;
  isActivated;
  name;
  city;
  bio;
  avatarUrl;
  phoneNumber;
  ads;

  constructor(model) {
    const baseUrl = process.env.API_URL; // http://localhost:4000

    this.id = model.id;
    this.email = model.email;
    this.login = model.login;
    this.isActivated = model.isActivated;
    this.name = model.name;
    this.city = model.city;
    this.bio = model.bio;
    this.phoneNumber = model.phoneNumber;

    // ✅ Формируем полный путь к аватару
    this.avatarUrl = model.avatarUrl
      ? `${baseUrl}${model.avatarUrl}`
      : null;

    // Объявления
    if (model.ads) {
      this.ads = model.ads.map(ad => ({
        id: ad.ad_id,
        name: ad.name,
        typeOfTrening: ad.typeOfTrening,
        description: ad.description,
        price: ad.price,
        date: ad.date,
        moderation: ad.moderation,
        city_ad: ad.city_ad,
        photo: ad.namePhoto
          ? `${baseUrl}/uploads/${ad.namePhoto}`
          : null,
      }));
    } else {
      this.ads = [];
    }
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      login: this.login,
      isActivated: this.isActivated,
      name: this.name,
      city: this.city,
      bio: this.bio,
      avatarUrl: this.avatarUrl,
      phoneNumber: this.phoneNumber,
      ads: this.ads,
    };
  }

  toPayload() {
    return {
      id: this.id,
      login: this.login,
    };
  }

  toProfile() {
    return {
      id: this.id,
      login: this.login,
      ads: this.ads,
    };
  }
}

module.exports = UserDto;
