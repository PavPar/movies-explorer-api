/* eslint-disable no-shadow */
const Movie = require('../models/movie');
const ErrorHandler = require('../utils/errorHandler/ErrorHandler');
const movieMSG = require('../utils/constants/constant__msg-movie');

const handleError = (err) => {
  if (err.name === 'CastError') {
    throw new ErrorHandler.BadRequestError(movieMSG.notFound);
  }

  if (err.name === 'ValidationError') {
    throw new ErrorHandler.BadRequestError(movieMSG.badData);
  }

  if (err.name === 'OwnershipError') {
    throw new ErrorHandler.BadRequestError(movieMSG.notOwner);
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
        throw (new ErrorHandler.NotFoundError(movieMSG.notFound));
      }

      if (`${movie.owner}` !== req.user._id) {
        console.log(movie);
        throw (new ErrorHandler.ForbiddenError(movieMSG.notOwner));
      }
      Movie.deleteOne({ movieID: req.params.movieID })
        .then((movies) => {
          if (movies.deletedCount === 0) {
            throw (new ErrorHandler.NotFoundError(movieMSG.notFound));
          }

          res.send({ message: movieMSG.deleted });
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
        throw (new ErrorHandler.ConflictError(movieMSG.alreadyExists));
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
