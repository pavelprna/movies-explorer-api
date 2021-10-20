require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { createUser } = require('./controllers/user');

const NotFoundError = require('./errors/not-found-error');
const error = require('./middlewares/error');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.post('/signup', createUser);

app.use('/users', require('./routes/user'));

app.get('*', () => {
  throw new NotFoundError('Ресурс не найден');
});

app.use(error);

app.listen(PORT, () => {
  console.log(`App listening port ${PORT}`);
});
