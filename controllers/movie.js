const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const BadRequestError = require('../errors/bad-request-error');
const Movie = require('../models/movie');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

const addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((error) => {
      console.log(error);
      if (error.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании фильма');
      } else {
        next(error);
      }
    })
    .catch(next);
};

const removeMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .orFail(() => new NotFoundError('Фильм с указанным _id не найден'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Можно удалять только свои фильмы');
      } else {
        Movie.deleteOne(movie)
          .then(() => res.send(movie));
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequestError('Неверно указан _id фильма');
      } else {
        next(error);
      }
    })
    .catch(next);
};

module.exports = { getMovies, addMovie, removeMovie };
