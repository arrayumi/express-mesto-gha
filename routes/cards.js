const router = require('express').Router();

const {
  getCards, createCard, deleteCard, addLike, deleteLike,
} = require('../controllers/cards');

const { validateCreateCard } = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', addLike);
router.delete('/:cardId/likes', deleteLike);

module.exports = router;
