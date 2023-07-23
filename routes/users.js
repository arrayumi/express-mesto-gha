const router = require('express').Router();

const {
  getUsers, getUser, updateProfile, updateAvatar, getUserinfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.get('/me', getUserinfo);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
