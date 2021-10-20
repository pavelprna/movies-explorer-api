require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const NotFoundError = require('./errors/not-found-error');
const error = require('./middlewares/error');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use('/users', require('./routes/user'));

app.get('*', () => {
  throw new NotFoundError('Ресурс не найден');
});

app.use(error);

app.listen(PORT, () => {
  console.log(`App listening port ${PORT}`);
});
