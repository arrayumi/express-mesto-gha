const router = require('express').Router();

const {
  getUsers, getUser, updateProfile, updateAvatar, getUserinfo,
} = require('../controllers/users');

const { validateUpdateProfile, validateUpdateAvatar } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getUserinfo);
router.get('/:userId', getUser);
router.patch('/me', validateUpdateProfile, updateProfile);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
