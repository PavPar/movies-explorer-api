const router = require('express').Router();

const userRouter = require('./user');
const movieRouter = require('./movie');

router.use(
  userRouter,
  movieRouter,
);

module.exports = router;
