const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const serverError = 500;
const notFoundError = 404;
const invalidDataError = 400;

const SALT_ROUNDS = 10;
const { JWT_SECRET } = require('../middlewares/auth');

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
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.findOne({ email })
    .then((userExists) => {
      if (userExists) return res.status(409).send({ message: 'Пользователь с таким email уже зарегистрирован' });
      return bcrypt.hash(password, SALT_ROUNDS)
        .then((hash) => User.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        }))
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
    })
    .catch(() => {
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

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) res.status(invalidDataError).send({ message: 'Поля email или пароль не могут быть пустыми' });
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) return res.status(invalidDataError).send({ message: 'Пользователь с таким email не существует' });
      return bcrypt.compare(password, user.password)
        .then((isPasswordValid) => {
          if (!isPasswordValid) return res.status(401).send({ message: 'Пароль указан неверно' });
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
          return res.status(200).send({ token });
        })
        .catch(() => {
          res.status(invalidDataError).send({ message: 'Некорректные данные' });
        });
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

const getUserinfo = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) return res.status(notFoundError).send({ message: 'Пользователь не найден' });
      return res.send(user);
    })
    .catch(() => {
      res.status(invalidDataError).send({ message: 'Некорректные данные' });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateProfile,
  updateAvatar,
  login,
  getUserinfo,
};
