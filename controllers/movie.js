/* eslint-disable no-shadow */
const Movie = require('../models/movie');
const ErrorHandler = require('../utils/errorHandler/ErrorHandler');

const handleError = (err) => {
  if (err.name === 'CastError') {
    throw new ErrorHandler.BadRequestError('Фильм не найден');
  }

  if (err.name === 'ValidationError') {
    throw new ErrorHandler.BadRequestError('Данные фильма неправильные');
  }

  if (err.name === 'OwnershipError') {
    throw new ErrorHandler.BadRequestError('Вы не являетесь владельцем фильма');
  }

  console.log(err);
  throw (err);
};

module.exports.getMovies = (req, res, next) => Movie.find({})
  .then((movies) => {
    res.send(Object.values(movies));
  })
  .catch((err) => next(err));

module.exports.deleteMovie = (req, res, next) => {
  Movie.find({ movieID: req.params.movieID })
    .then((movies) => {
      const movie = movies[0];
      if (!movie) {
        throw (new ErrorHandler.NotFoundError('Фильм не найден'));
      }

      if (`${movie.owner}` !== req.user._id) {
        console.log(movie);
        throw (new ErrorHandler.ForbiddenError('Вы не являетесь владельцем фильма'));
      }
      Movie.deleteOne({ movieID: req.params.movieID })
        .then((movies) => {
          if (movies.deletedCount === 0) {
            throw (new ErrorHandler.NotFoundError('Фильм не найден'));
          }

          res.send({ message: 'Фильм удален' });
        });
    })
    .catch((err) => handleError(err))
    .catch((err) => next(err));
};

/*

*/
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieID,
  } = req.body;
  Movie.find({ movieID })
    .then((movies) => {
      if (movies.length > 0) {
        console.log(movies);
        throw (new ErrorHandler.ConflictError('Фильм уже добавлен'));
      }
      Movie.create(
        {
          country,
          director,
          duration,
          year,
          description,
          image,
          trailer,
          nameRU,
          nameEN,
          thumbnail,
          movieID,
          owner: req.user._id,
        },
      ).then((movie) => res.send(movie))
        .catch((err) => handleError(err))
        .catch((err) => next(err));
    })
    .catch((err) => handleError(err))
    .catch((err) => next(err));
};
