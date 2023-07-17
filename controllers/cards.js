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
      res.send(card);
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
    .then((card) => {
      if (!card) {
        res.status(notFoundError).send({ message: 'Карточка не найдена' });
      }
      res.send({ data: card });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        res.status(invalidDataError).send({ message: 'Некорректный id карточки' });
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
    .then((card) => {
      if (!card) {
        res.status(notFoundError).send({ message: 'Карточка не найдена' });
      }
      res.send({ data: card });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        res.status(invalidDataError).send({ message: 'Некорректный id карточки' });
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
    .then((card) => {
      if (!card) {
        res.status(notFoundError).send({ message: 'Карточка не найдена' });
      }
      res.send({ data: card });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        res.status(invalidDataError).send({ message: 'Некорректный id карточки' });
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
