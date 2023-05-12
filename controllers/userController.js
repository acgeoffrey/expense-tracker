const User = require('../models/user');

/*** Render the Dashboard ***/
module.exports.dashboard = async function (req, res) {
  if (req.isAuthenticated()) {
    return res.render('dashboard', {
      title: 'Dashboard | Expense Tracker',
    });
  } else {
    return res.redirect('/');
  }
};

/*** Render the Login page ***/
module.exports.login = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard');
  }

  return res.render('login', {
    title: 'Login | Expense Tracker',
  });
};

/*** Signin and Create a session for the user ***/
module.exports.createSession = function (req, res) {
  req.flash('success', 'Logged in Successfully');
  return res.redirect('/dashboard');
};

/*** Signout the user ***/
module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  req.flash('success', 'You have Logged out!');
  return res.redirect('/');
};
