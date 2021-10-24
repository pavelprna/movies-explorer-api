const { Joi, celebrate } = require('celebrate');
const validator = require('validator');
const BadRequerstError = require('../errors/bad-request-error');

const isUrlValidator = (link) => {
  const result = validator.isURL(link);
  if (!result) {
    throw new BadRequerstError('Неверный формат URL');
  } else {
    return link;
  }
};

const createUserValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const userValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const addMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(isUrlValidator),
    trailer: Joi.string().required().custom(isUrlValidator),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom(isUrlValidator),
    movieId: Joi.number().required(),
  }),
});

const removeMovieValidator = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required(),
  }),
});

module.exports = {
  createUserValidator, loginValidator, userValidator, addMovieValidator, removeMovieValidator,
};
