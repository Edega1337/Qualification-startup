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
  editProfileUser
} = require('../controllers/controllers');

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
    }
  };
}

module.exports = { router };

