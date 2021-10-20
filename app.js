require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { createUser, login } = require('./controllers/user');

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

app.post('/signup', createUser);
app.post('/signin', login);

app.use('/users', require('./routes/user'));

app.get('*', () => {
  throw new NotFoundError('Ресурс не найден');
});

app.use(error);

app.listen(PORT, () => {
  console.log(`App listening port ${PORT}`);
});
