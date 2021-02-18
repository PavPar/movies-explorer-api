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
  throw (err);
};

module.exports.getMovies = (req, res, next) => Movie.find({})
  .then((movies) => {
    res.send(Object.values(movies));
  })
  .catch((err) => next(err));

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById({ _id: req.params.movieID })
    .then((movie) => {
      if (!movie) {
        throw (new ErrorHandler.NotFoundError('Фильм не найден'));
      }

      if (`${movie.owner}` !== req.user._id) {
        throw (new ErrorHandler.ForbiddenError('Вы не являетесь владельцем фильма'));
      }
      Movie.deleteOne({ _id: req.params.movieId })
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
  } = req.body;
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
    },
  ).then((movie) => res.send(movie))
    .catch((err) => handleError(err))
    .catch((err) => next(err));
};
