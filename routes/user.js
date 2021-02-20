/* eslint-disable arrow-parens */

const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const usersController = require('../controllers/user');

router.get('/users/me', usersController.getUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), usersController.updateUser);

module.exports = router;
