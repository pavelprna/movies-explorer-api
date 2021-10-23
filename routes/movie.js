const router = require('express').Router();
const { addMovieValidator, removeMovieValidator } = require('../middlewares/validation');
const { getMovies, addMovie, removeMovie } = require('../controllers/movie');

router.get('/', getMovies);
router.post('/', addMovieValidator, addMovie);
router.delete('/:movieId', removeMovieValidator, removeMovie);

module.exports = router;
