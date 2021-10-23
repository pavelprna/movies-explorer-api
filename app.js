require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUserValidator, loginValidator } = require('./middlewares/validation');
const { createUser, login } = require('./controllers/user');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-error');
const error = require('./middlewares/error');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.post('/signup', createUserValidator, createUser);
app.post('/signin', loginValidator, login);

app.use(auth);

app.use('/users', require('./routes/user'));
app.use('/movies', require('./routes/movie'));

app.get('*', () => {
  throw new NotFoundError('Ресурс не найден');
});

app.use(errorLogger);
app.use(error);

app.listen(PORT, () => {
  console.log(`App listening port ${PORT}`);
});
