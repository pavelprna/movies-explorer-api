const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const BadRequestError = require('../errors/bad-request-error');
const Movie = require('../models/movie');
const {
  VALIDATION_ERROR, errorMessage, okMessage, CAST_ERROR,
} = require('../utils/constants');

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
      if (error.name === VALIDATION_ERROR) {
        throw new BadRequestError(errorMessage.incorrectMovieData);
      } else {
        next(error);
      }
    })
    .catch(next);
};

const removeMovie = (req, res, next) => {
  const { id } = req.params;

  Movie.findById(id)
    .orFail(() => new NotFoundError(errorMessage.incorrectMovieId))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError(errorMessage.notOwnerDeletion);
      } else {
        return movie.deleteOne()
          .then(() => res.send({ message: okMessage.movieDeleted }));
      }
    })
    .catch((error) => {
      if (error.name === CAST_ERROR) {
        throw new BadRequestError(errorMessage.incorrectMovieId);
      } else {
        next(error);
      }
    })
    .catch(next);
};

module.exports = { getMovies, addMovie, removeMovie };
