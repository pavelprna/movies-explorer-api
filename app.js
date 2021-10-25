require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const error = require('./middlewares/error');
const {
  PORT,
  MONGODB_URL,
  CORS_ALLOW_LIST,
  errorMessage,
} = require('./utils/constants');

const app = express();

const corsOptions = {
  origin(origin, callback) {
    if (CORS_ALLOW_LIST.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error(errorMessage.corsError));
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

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(error);

app.listen(PORT, () => {
  console.log(`App listening port ${PORT}`);
});
