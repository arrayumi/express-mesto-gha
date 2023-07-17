const mongoose = require('mongoose');
const User = require('../models/user');

const serverError = 500;
const notFoundError = 404;
const invalidDataError = 400;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res
        .status(serverError)
        .send({ message: 'Ошибка на сервере' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(invalidDataError).send({ message: 'Невалидные данные' });
        return;
      }
      res.status(serverError).send({ message: 'Ошибка на сервере' });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(new Error('notValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.message === 'notValidId') {
        res.status(notFoundError).send({ message: 'Некорректный id пользователя' });
        return;
      }
      if (error instanceof mongoose.Error.CastError) {
        res.status(invalidDataError).send({ message: 'Некорректные данные' });
        return;
      }
      res.status(serverError).send({ message: 'Ошибка на сервере' });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(notFoundError).send({ message: 'Пользователь не найден' });
      }
      res.send(user);
    })
    .catch((error) => {
      if ((error instanceof mongoose.Error.CastError)
        || (error instanceof mongoose.Error.ValidationError)) {
        res.status(invalidDataError).send({ message: 'Некорректные данные' });
        return;
      }
      res.status(serverError).send({ message: 'Ошибка на сервере' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(notFoundError).send({ message: 'Пользователь не найден' });
      }
      res.send(user);
    })
    .catch((error) => {
      if ((error instanceof mongoose.Error.CastError)
        || (error instanceof mongoose.Error.ValidationError)) {
        res.status(invalidDataError).send({ message: 'Некорректные данные' });
        return;
      }
      res.status(serverError).send({ message: 'Ошибка на сервере' });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateProfile,
  updateAvatar,
};
