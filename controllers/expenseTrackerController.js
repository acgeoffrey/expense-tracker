const User = require('../models/user');
const Expense = require('../models/expense');
const Dates = require('../models/date');

module.exports.create = async (req, res) => {
  try {
    if (req.user) {
      // let date = new Date().toLocaleDateString('en-GB').split('/').join('-');
      let date = req.body.date.split('-').reverse().join('-');
      let dateFind = await Dates.find({ date: date, user: req.user });
      let dates;
      if (dateFind.length === 0) {
        dates = await Dates.create({
          date: date,
          user: req.user,
        });
      } else {
        dates = dateFind[0];
      }

      let newExpense = await Expense.create({
        name: req.body.name,
        cost: req.body.cost,
        user: req.user,
        date: dates,
      });

      dates.expenses.push(newExpense);
      dates.totalExpense += parseInt(req.body.cost);
      dates.save();

      return res.redirect('back');
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.destroy = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    const date = await Dates.findById(expense.date);
    if (expense.user == req.user.id || date.user == req.user.id) {
      date.totalExpense = date.totalExpense - expense.cost;
      expense.deleteOne();
      await Dates.findByIdAndUpdate(date.id, {
        $pull: { expenses: req.params.id },
      });
      date.save();
      req.flash('success', 'Expense deleted!');
      return res.redirect('back');
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.stats = async (req, res) => {
  const dates = await Dates.find({ user: req.user });
  let today = parseInt(new Date().toLocaleDateString('en-GB').slice(3, 5));
  let totalMonth = 0;
  for (let i = 0; i < dates.length; i++) {
    let a = parseInt(dates[i].date.slice(3, 5));
    if (a == today) {
      totalMonth += dates[i].totalExpense;
    }
  }

  res.render('stats', {
    title: 'Statistics | Expense Tracker',
    total_month: totalMonth,
  });
};
