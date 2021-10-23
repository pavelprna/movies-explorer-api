require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUserValidator, loginValidator } = require('./middlewares/validation');
const { createUser, login, signout } = require('./controllers/user');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-error');
const error = require('./middlewares/error');

const { PORT = 3000 } = process.env;

const app = express();

const allowList = [
  'https://prna.nomoredomains.club',
  'http://prna.nomoredomains.club',
  'http://localhost:3000',
];

const corsOptions = {
  origin(origin, callback) {
    if (allowList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.post('/signup', createUserValidator, createUser);
app.post('/signin', loginValidator, login);
app.post('/signout', signout);

app.use(auth);

app.use('/users', require('./routes/user'));
app.use('/movies', require('./routes/movie'));

app.get('*', () => {
  throw new NotFoundError('Ресурс не найден');
});

app.use(errorLogger);
app.use(errors());
app.use(error);

app.listen(PORT, () => {
  console.log(`App listening port ${PORT}`);
});
