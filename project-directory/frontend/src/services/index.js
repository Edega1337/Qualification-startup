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

/**
 * Получить детали объявления по ID
 * @param {number|string} adId
 * @returns {Promise<object>} - данные объявления
 */
const getAdService = async (adId) => {
  try {
    const response = await $api.get(`/ads/${adId}`);
    return response.data.ad || response.data;
  } catch (error) {
    console.error('Ошибка при получении деталей объявления', error);
    throw error;
  }
};

/**
 * Получить список откликов к объявлению (для владельца)
 * @param {number|string} adId
 * @returns {Promise<Array>} - массив откликов
 */
const getAdResponsesService = async (adId) => {
  try {
    const response = await $api.get(`/ads/${adId}/responses`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return [];
    }
    console.error('Ошибка при получении списка откликов', error);
    throw error;
  }
};

/**
 * Отправить отклик на объявление
 * @param {number|string} adId
 * @param {{ date: string, message: string }} payload
 * @returns {Promise<object>} - созданный отклик
 */
const respondToAdService = async (adId, { date, message }) => {
  try {
    const response = await $api.post(
      `/ads/${adId}/respond`,
      { date, message }
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке отклика', error);
    throw error;
  }
};

export { logInService, signUpService, refreshTokenService, currentUserService, getUserInfo, sendAdService, editUserProfileService, deleteAdUser, getAdService, getAdResponsesService, respondToAdService };
