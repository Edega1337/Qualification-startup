const multer = require('fastify-multer');
const {
  validationAuthorization,
  validationRegistration
} = require('../middleware/users-validation');
const {
  registerUser,
  authUser,
  logout,
  refresh,
  activateUser,
  currentUser,
  profileUsers,
  loadAd,
  editProfileUser,
  deleteAdController,
  searchAd,
  getAd,
  postResponse,
  userResponsesHandler
} = require('../controllers/controllers');
const { listResponses } = require('../services/ad-service');

function router() {
  return {
    registration: {
      method: 'POST',
      url: 'registration',
      handler: registerUser,
      schema: {
        body: {
          type: 'object',
          required: ['email', 'login', 'password'],
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
            user: { type: 'object' }
          }
        },
        preHandler: validationRegistration
      }
    },
    authorization: {
      method: 'POST',
      url: 'authorization',
      handler: authUser,
      schema: {
        body: {
          type: 'object',
          required: ['login', 'password'],
          properties: {
            login: { type: 'string' },
            password: { type: 'string' }
          }
        },
        preHandler: validationAuthorization
      }
    },
    logout: {
      method: 'POST',
      url: 'logout',
      handler: logout,
    },
    activate: {
      method: 'GET',
      url: 'activate/:link',
      handler: activateUser,
    },
    refresh: {
      method: 'GET',
      url: 'auth/refresh',
      handler: refresh,
    },
    userMe: {
      method: 'GET',
      url: 'user/me',
      handler: currentUser,
    },
    profile: {
      method: 'GET',
      url: 'user/:login',
      handler: profileUsers,
    },
    userLoadAd: {
      method: 'POST',
      url: 'user/ad',
      handler: loadAd,
    },
    profileEdit: {
      method: 'PUT',
      url: 'profile',
      handler: editProfileUser,
    },
    deleteAd: {
      method: 'DELETE',
      url: 'ads/:id',
      handler: deleteAdController,
    },
    searchAds: {
      method: 'GET',
      url: 'ads/search',
      handler: searchAd,
    },
    getAd: {
      method: 'GET',
      url: 'ads/:id',
      handler: getAd
    },
    postResponse: {
      method: 'POST',
      url: 'ads/:id/respond',
      handler: postResponse,
    },
    listResponses: {
      method: 'GET',
      url: 'ads/:id/responses',
      handler: listResponses,
    },
    userResponses: {
      method: 'GET',
      url: 'user/responses',
      handler: userResponsesHandler,
    }
  };
}

module.exports = { router };

