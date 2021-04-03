/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes/index');
const authRoute = require('./routes/auth');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimiter = require('./middlewares/rateLimiter');
const ErrorHandler = require('./utils/errorHandler/ErrorHandler');
const { errorSender } = require('./middlewares/errorSender');
require('dotenv').config({ path: path.join(__dirname, 'envVars.env') });

if (process.env.NODE_ENV !== 'production') {
  process.env.JWT_SECRET = 'supersecret';
  process.env.JWT_LIFESPAN = '7d';
  process.env.DB = 'mongodb://localhost:27017/bitfilmsdb';
}

const app = express();

app.use(cors());

app.use(requestLogger);

app.use(rateLimiter);
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.DB, {
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

app.use(authRoute);
app.use(auth);
app.use(routes);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('*', () => {
  throw new ErrorHandler.NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);
app.use(errors());

app.use(errorSender);

app.listen(PORT, () => {
  console.log(`SUCCESS: server is running on port : ${PORT}`);
});
