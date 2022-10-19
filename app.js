require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const errorRouter = require('./routes/error');
const appRouter = require('./routes/app');
const { auth } = require('./middlewares/auth');
const handleError = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, NODE_ENV, DATA_URL } = process.env;

const app = express();

app.use(helmet());

mongoose.connect(NODE_ENV === 'production' ? DATA_URL : 'mongodb://localhost:27017/bitfilmsdb');

app.use(requestLogger);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', appRouter);

app.use(auth);

app.use('/', usersRouter);
app.use('/', moviesRouter);
app.use('/', errorRouter);

app.use(errorLogger);

app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Слушаем порт: ${PORT}`);
});
