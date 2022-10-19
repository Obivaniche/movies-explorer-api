const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../utils/ConflictError');
const NotFoundError = require('../utils/NotFound');
const BadRequestError = require('../utils/BadRequest');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id).then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send({ data: user });
  }).catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => User.create({
    name, email, password: hash,
  }))
    .then((user) => {
      res.send({
        data: {
          email: user.email,
          name: user.name,
          _id: user._id,
        },
      });
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError('Пользователь уже зарегестрирован'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      throw new NotFoundError('Пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
        return;
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный ID'));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError('Пользователь уже зарегестрирован'));
      }
      next(err);
    });
};
