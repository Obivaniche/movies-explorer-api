const router = require('express').Router();
const NotFoundError = require('../utils/NotFound');

router.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
