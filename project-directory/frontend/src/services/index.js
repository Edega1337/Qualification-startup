import $api from "../http";
import { jwtDecode } from "jwt-decode";


const getUserInfo = () => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    try {
      const decodedToken = jwtDecode(accessToken);

      if (decodedToken.login) {
        return decodedToken.login;
      }
    } catch (error) {
      console.error('Ошибка декодирования токена', error);
    }
  }
}

const signUpService = async (signUpData) => {
  try {
    const response = await $api.post(`/registration`, signUpData);

    return response.data;
  }
  catch (error) {
    console.error('Ошибка регистрации', error);
    throw error;
  }
};

const logInService = async (loginData) => {
  const response = await $api.post(`/authorization`, loginData);

  return response.data;
};

const sendAdService = async (formData) => {
  const response = await $api.post('user/ad', formData);

  return response.data;
};

const refreshTokenService = async () => {
  const response = await $api.get(`/auth/refresh`);

  return response.data.accessToken;
};

const currentUserService = async () => {
  const response = await $api.get(`/user/me`);

  return response.data;
};

const editUserProfileService = async (formData) => {
  try {
    const response = await $api.put(`/profile`, formData);

    return response.data;
  } catch (error) {
    console.error('Ошибка редактирования данных профиля');
    throw error;
  }

};

const deleteAdUser = async (adId) => {
  try {
    const response = await $api.delete(`/ads/${adId}`);
    console.log('Объявление удалено', response.data);
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении объявления', error);
    throw error;
  }
};

export { logInService, signUpService, refreshTokenService, currentUserService, getUserInfo, sendAdService, editUserProfileService, deleteAdUser };
