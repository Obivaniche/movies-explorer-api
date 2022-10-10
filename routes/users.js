const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { getUserMe, updateUserInfo } = require('../controllers/users');

router.get('/users/me', getUserMe);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
    }),
  }),
  updateUserInfo,
);

module.exports = router;