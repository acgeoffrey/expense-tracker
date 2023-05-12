const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../controllers/userController');

router.get(
  '/dashboard',
  passport.checkAuthentication,
  userController.dashboard
);

router.get('/', userController.login);

//Google authentication
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/users/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/signin' }),
  userController.createSession
);

router.get('/signout', userController.destroySession);

module.exports = router;
