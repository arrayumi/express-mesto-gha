const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Ошибка на сервере' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  if (!name || !link) {
    res
      .status(400)
      .send({ message: 'Невалидные данные' });
    return;
  }

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'Error') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: 'Карточка не найдена' });
      }
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'Error') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
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
        res
          .status(404)
          .send({ message: 'Карточка не найдена' });
      }
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'Error') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
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
        res
          .status(404)
          .send({ message: 'Карточка не найдена' });
        return;
      }
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'Error') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
