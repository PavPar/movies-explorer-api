/* eslint-disable no-useless-escape */

/*
    country — страна создания фильма. Обязательное поле-строка.
    director — режиссёр фильма. Обязательное поле-строка.
    duration — длительность фильма. Обязательное поле-число.
    year — год выпуска фильма. Обязательное поле-строка.
    description — описание фильма. Обязательное поле-строка.
    image — ссылка на постер к фильму. Обязательное поле-строка. Запишите её URL-адресом.
    trailer — ссылка на трейлер фильма. Обязательное поле-строка. Запишите её URL-адресом.
    thumbnail — миниатюрное изображение постера к фильму. Обязательное поле-строка.
    Запишите её URL-адресом.
    owner — _id пользователя, который сохранил статью. Обязательное поле.
    movieId — id фильма, который содержится в ответе сервиса MoviesExplorer. Обязательное поле.
    nameRU — название фильма на русском языке. Обязательное поле-строка.
    nameEN — название фильма на английском языке. Обязательное поле-строка.
*/

const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,

  },
  director: {
    type: String,
    required: true,

  },
  duration: {
    type: Number,
    required: true,

  },
  year: {
    type: Number,
    required: true,

  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(uri) {
        return validator.isURL(uri);
      },
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(uri) {
        return validator.isURL(uri);
      },
    },

  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(uri) {
        return validator.isURL(uri);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movieID: {
    type: String,
    required: true,
    unique: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
