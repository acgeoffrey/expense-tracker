const User = require('../models/user');
const Expense = require('../models/expense');
const Dates = require('../models/date');
const { redirect } = require('express/lib/response');

/*** Render the Dashboard ***/
module.exports.dashboard = async function (req, res) {
  try {
    let specificDate = false;
    let today = new Date().toLocaleDateString('en-GB').split('/').join('-');
    if (req.body.date) {
      specificDate = true;
      today = req.body.date.split('-').reverse().join('-');
    }
    let date = await Dates.find({ date: today, user: req.user }).populate({
      path: 'expenses',
      options: { sort: [{ amount: -1 }] },
    });

    let otherDates = await Dates.find({ user: req.user })
      .sort('-date')
      .limit(10)
      .populate({
        path: 'expenses',
      });

    if (req.isAuthenticated()) {
      return res.render('dashboard', {
        title: 'Dashboard | Expense Tracker',
        dates: date[0],
        otherDates: otherDates,
        specificDate: specificDate,
        link: 'Stats',
      });
    } else {
      return res.redirect('/');
    }
  } catch (err) {
    console.log(err);
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

/*** Add Tags ***/
module.exports.addTags = async (req, res) => {
  try {
    if (req.user) {
      const tag = req.body.tag.toLowerCase();
      const user = await User.findById(req.params.id);
      user.tags.forEach((item) => {
        if (item === tag) {
          req.flash('error', `${tag} Tag already exists!`);
          return res.redirect('back');
        }
      });
      user.tags.push(tag);
      user.save();
      req.flash('success', `${tag} Tag added!`);
      res.redirect('back');
    }
  } catch (err) {
    console.log(err);
  }
};

/*** Remove Tags ***/
module.exports.removeTags = async (req, res) => {
  try {
    if (req.user) {
      const tag = req.body.tag.toLowerCase();
      const user = await User.findById(req.params.id);
      const index = user.tags.indexOf(tag);
      if (index === -1) {
        req.flash('error', `${tag} Tag does not exist!`);
        res.redirect('back');
      }
      user.tags.splice(index, 1);
      user.save();
      req.flash('success', `${tag} Tag removed!`);
      res.redirect('back');
    }
  } catch (error) {
    console.log(error);
  }
};
