const Movie = require('../models/movie');
const ForbiddenError = require('../utils/Forbidden');
const NotFoundError = require('../utils/NotFound');
const BadRequestError = require('../utils/BadRequest');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({
      data: movies,
    }))
    .catch(next);
};

module.exports.addMovie = (req, res, next) => {
  const { name, link } = req.body;
  Movie.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((movie) => res.send({
      data: movie,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
    Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (req.user._id !== movie.owner.toString()) {
        throw new ForbiddenError('Нельзя удалить чужую карточку!');
      }
      return movie.remove().then(res.send({ data: movie }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные'));
        return;
      }
      next(err);
    });
};
