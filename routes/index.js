const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../controllers/userController');
const expenseTrackerController = require('../controllers/expenseTrackerController');

/*** AUTHENTICATION ROUTES ***/
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
  passport.authenticate('google', { failureRedirect: '/' }),
  userController.createSession
);

router.get('/signout', userController.destroySession);

router.get('/dashboard/stats', expenseTrackerController.stats);
router.post('/dashboard/stats', expenseTrackerController.stats);

/*** CRUD ***/
router.post('/create', expenseTrackerController.create);
router.get('/delete/:id', expenseTrackerController.destroy);
router.post('/add-tags/:id', userController.addTags);

module.exports = router;
