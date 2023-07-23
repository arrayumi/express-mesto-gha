const { celebrate, Joi } = require('celebrate');

const regexLink = /(http(s)?:\/\/(www\.)?)[0-9a-zA-Z\-._~:/?#[\]@!$&'()*+,;=]+#?/;

// login and register
const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regexLink),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
});

// users

const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(regexLink),
  }),
});

// cards

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(regexLink),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateUpdateProfile,
  validateUpdateAvatar,
  validateCreateCard,
};
