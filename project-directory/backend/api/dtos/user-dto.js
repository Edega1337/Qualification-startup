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
  role; // 'client' | 'coach'

  constructor(model) {
    const baseUrl = process.env.API_URL;

    this.id = model.id;
    this.email = model.email;
    this.login = model.login;
    this.isActivated = model.isActivated;
    this.name = model.name;
    this.city = model.city;
    this.bio = model.bio;
    this.phoneNumber = model.phoneNumber;
    this.role = model.role ?? 'client';

    this.avatarUrl = model.avatarUrl ? `${baseUrl}${model.avatarUrl}` : null;

    if (model.ads) {
      this.ads = model.ads.map((ad) => ({
        id: ad.ad_id,
        name: ad.name,
        typeOfTrening: ad.typeOfTrening,
        description: ad.description,
        price: ad.price,
        date: ad.date,
        moderation: ad.moderation,
        city_ad: ad.city_ad,
        photo: ad.namePhoto ? `${baseUrl}/uploads/${ad.namePhoto}` : null,
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
      role: this.role,
    };
  }

  toPayload() {
    return {
      id: this.id,
      login: this.login,
      role: this.role,
    };
  }


  toProfile() {
    return {
      id: this.id,
      login: this.login,
      ads: this.ads,
      role: this.role,
    };
  }
}

module.exports = UserDto;