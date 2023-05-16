const User = require('../models/user');
const Expense = require('../models/expense');
const Dates = require('../models/date');

module.exports.create = async (req, res) => {
  try {
    if (req.user) {
      let today = new Date().toLocaleDateString('en-GB').split('/').join('-');
      let dateFind = await Dates.find({ date: today, user: req.user });
      let dates;
      if (dateFind.length === 0) {
        dates = await Dates.create({
          date: today,
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
