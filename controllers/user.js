const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler/ErrorHandler');

const handleError = (err) => {
  if (err.name === 'ValidationError') {
    throw (new ErrorHandler.BadRequestError('Данные пользователя неверные'));
  }

  if (err.name === 'CastError') {
    throw new ErrorHandler.NotFoundError('Такого пользователя нет');
  }

  throw (err);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => { throw new ErrorHandler.NotFoundError('Такого пользователя нет'); })
    .then((userData) => res.send(userData))
    .catch((err) => handleError(err))
    .catch((err) => next(err));
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email },
    {
      new: true,
      runValidators: true,
    })
    .orFail(() => { throw new ErrorHandler.NotFoundError('Такого пользователя нет'); })
    .then((users) => res.send(users))
    .catch((err) => handleError(err))
    .catch((err) => next(err));
};

module.exports.authUser = (req, res, next) => {
  const { email, password } = req.body;
  let userID;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new ErrorHandler.UnauthorizedError('Неправильные почта или пароль');
      }
      userID = user._id;
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        throw new ErrorHandler.UnauthorizedError('Неправильные почта или пароль');
      }
      const token = jwt.sign(
        { _id: userID._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFESPAN },
      );
      res.send({
        token,
      });

      return true;
    })
    .catch((err) => handleError(err))
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  User.exists({ email })
    .then((exists) => {
      if (exists) {
        throw (new ErrorHandler.ConflictError('Email занят'));
      }
    })
    .then(() => {
      bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({
            name, email, password: hash,
          })
            .then((user) => {
              const userData = user.toObject();
              delete userData.password;
              res.send(userData);
            })
            .catch((err) => handleError(err))
            .catch((err) => next(err));
        });
    })
    .catch((err) => handleError(err))
    .catch((err) => next(err));
};
