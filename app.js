/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const { errors } = require('celebrate');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const routes = require('./routes/index');
const authRoute = require('./routes/auth');
// const auth = require('./middlewares/auth');
// const ErrorHandler = require('./utils/errorHandler/ErrorHandler');
// const { requestLogger, errorLogger } = require('./middlewares/logger');

// require('dotenv').config({ path: path.join(__dirname, 'envVars.env') });

const app = express();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  .then(() => {
    console.log('SUCCESS: DB connected');
  })
  .catch(() => {
    console.log('FAILED: DB Connection');
  });

const { PORT = '3000' } = process.env;

app.use(cors());

// app.use(requestLogger);

// app.use(authRoutes);
// app.use(auth);
// app.use(routes);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// app.use('*', () => {
//   throw new ErrorHandler.NotFoundError('Запрашиваемый ресурс не найден');
// });

// app.use(errorLogger);
app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`SUCCESS: server is running on port : ${PORT}`);
});
