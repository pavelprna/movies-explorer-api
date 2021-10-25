const router = require('express').Router();
const { addMovieValidator, removeMovieValidator } = require('../middlewares/validation');
const { getMovies, addMovie, removeMovie } = require('../controllers/movie');

router.get('/movies', getMovies);
router.post('/movies', addMovieValidator, addMovie);
router.delete('/movies/:id', removeMovieValidator, removeMovie);

module.exports = router;
