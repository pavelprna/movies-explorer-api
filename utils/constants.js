const {
  NODE_ENV, JWT_SECRET, PORT = 3000, MONGODB_URL,
} = process.env;

const CORS_ALLOW_LIST = [
  'https://prna.nomoredomains.club',
  'http://prna.nomoredomains.club',
  'http://localhost:3000',
];

const VALIDATION_ERROR = 'ValidationError';
const CAST_ERROR = 'CastError';

const BAD_REQUEST_CODE = 400;
const UNAUTHORIZED_CODE = 401;
const FORBIDDEN_CODE = 403;
const NOT_FOUND_CODE = 404;
const CONFLICT_CODE = 409;
const INTERNAL_SERVER_CODE = 500;

const errorMessage = {
  incorrectMovieData: 'Переданы некорректные данные при создании фильма',
  incorrectMovieId: 'Фильм с указанным _id не найден',
  notOwnerDeletion: 'Можно удалять только свои фильмы',
  incorrectUpdateUserData: 'Переданы некорректные данные при обновлении пользователя',
  incorrectCreateUserData: 'Переданы некорректные данные при создании пользователя',
  incorrectUserId: 'Неверно указан _id пользователя',
  conflictUserEmail: (email) => `email ${email || ''} уже зарегистрирован`,
  notFoundUserId: 'Нет пользователя с таким _id',
  incorrectToken: 'Присланный токен некорректен',
  incorrectUrl: 'Неверный формат ссылки',
  incorrectEmail: 'Неверный формат email',
  incorrectAuthData: 'Неправильные почта или пароль',
  incorrectRoute: 'Ресурс не найден',
  corsError: 'Not allowed by CORS',
};

const okMessage = {
  movieDeleted: 'Фильм удален',
  signInDone: 'Вход успешно выполнен',
  signOutDone: 'Успешный выход',
};

module.exports = {
  PORT,
  JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
  MONGODB_URL: NODE_ENV === 'production' ? MONGODB_URL : 'mongodb://localhost:27017/moviesdb',
  CORS_ALLOW_LIST,
  VALIDATION_ERROR,
  CAST_ERROR,
  BAD_REQUEST_CODE,
  UNAUTHORIZED_CODE,
  FORBIDDEN_CODE,
  NOT_FOUND_CODE,
  CONFLICT_CODE,
  INTERNAL_SERVER_CODE,
  errorMessage,
  okMessage,
};
