const errors = (err, req, res, next) => {
  if (!err.statusCode) {
    res.status(500).send({ message: 'Ошибка на сервере' });
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
  next();
};

module.exports = errors;
