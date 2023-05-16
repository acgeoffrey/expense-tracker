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

router.get('/dashboard/profile', (req, res) => {
  res.render('profile', {
    title: 'Profile | Expense Tracker',
  });
});

router.get('/dashboard/stats', expenseTrackerController.stats);

/*** CRUD ***/
router.post('/create', expenseTrackerController.create);
router.get('/delete/:id', expenseTrackerController.destroy);

module.exports = router;
