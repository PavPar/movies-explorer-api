/* eslint-disable arrow-parens */

const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const movieController = require('../controllers/movie');

router.get('/movies', movieController.getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().uri().required(),
    trailer: Joi.string().uri().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().uri().required(),
    movieID: Joi.string().required().length(24),
  }),
}), movieController.createMovie);

router.delete('/movies/:movieID', celebrate({
  params: Joi.object().keys({
    movieID: Joi.string().hex().required().length(24),
  }),
}), movieController.deleteMovie);

module.exports = router;
