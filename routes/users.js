const router = require('express').Router();

const {
  getUsers, getUser, updateProfile, updateAvatar, getUserinfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserinfo);
router.get('/:userId', getUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
