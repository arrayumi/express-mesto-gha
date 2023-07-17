const mongoose = require('mongoose');
const Card = require('../models/card');

const serverError = 500;
const notFoundError = 404;
const invalidDataError = 400;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res
        .status(serverError)
        .send({ message: 'Ошибка на сервере' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(invalidDataError).send({ message: 'Невалидные данные' });
        return;
      }
      res.status(serverError).send({ message: 'Ошибка на сервере' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .orFail(new Error('notValidId'))
    .then((card) => {
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.message === 'notValidId') {
        res.status(notFoundError).send({ message: 'Некорректный id карточки' });
        return;
      }
      if (error instanceof mongoose.Error.CastError) {
        res.status(invalidDataError).send({ message: 'Некорректные данные' });
        return;
      }
      res.status(serverError).send({ message: 'Ошибка на сервере' });
    });
};

const addLike = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('notValidId'))
    .then((card) => {
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.message === 'notValidId') {
        res.status(notFoundError).send({ message: 'Некорректный id карточки' });
        return;
      }
      if (error instanceof mongoose.Error.CastError) {
        res.status(invalidDataError).send({ message: 'Некорректные данные' });
        return;
      }
      res.status(serverError).send({ message: 'Ошибка на сервере' });
    });
};

const deleteLike = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('notValidId'))
    .then((card) => {
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.message === 'notValidId') {
        res.status(notFoundError).send({ message: 'Некорректный id карточки' });
        return;
      }
      if (error instanceof mongoose.Error.CastError) {
        res.status(invalidDataError).send({ message: 'Некорректные данные' });
        return;
      }
      res.status(serverError).send({ message: 'Ошибка на сервере' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
