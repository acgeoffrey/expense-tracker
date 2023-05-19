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
      let tag;
      if (req.body.tag) {
        tag = req.body.tag;
      } else {
        tag = 'others';
      }
      let newExpense = await Expense.create({
        name: req.body.name,
        amount: req.body.amount,
        type: req.body.type,
        user: req.user,
        date: dates,
        notes: req.body.notes,
        tag: tag,
      });

      dates.expenses.push(newExpense);
      if (req.body.type == 'debit') {
        dates.totalExpense += parseInt(req.body.amount);
      } else {
        dates.totalIncome += parseInt(req.body.amount);
      }
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
      if (expense.type == 'debit') {
        date.totalExpense = date.totalExpense - expense.amount;
      } else {
        date.totalIncome = date.totalIncome - expense.amount;
      }
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
  try {
    let data = {};
    let monthData = {
      totalExpense: 0,
      totalIncome: 0,
      month:
        new Date().toLocaleString('default', { month: 'long' }) +
        ' ' +
        new Date().toLocaleDateString('en-GB').split('/').join('-').slice(6),
    };
    let today = parseInt(
      new Date().toLocaleDateString('en-GB').split('/').join('-').slice(3)
    );
    if (req.body.month) {
      today = parseInt(req.body.month.split('-').reverse().join('-'));
      monthData.month = new Date(req.body.month).toLocaleString('default', {
        month: 'long',
      });
      monthData.month += ' ' + req.body.month.slice(0, 4);
    }
    const dates = await Dates.find({ user: req.user });
    for (let i = 0; i < dates.length; i++) {
      let a = parseInt(dates[i].date.slice(3));
      if (a == today) {
        monthData.totalExpense += dates[i].totalExpense;
        monthData.totalIncome += dates[i].totalIncome;
      }
    }

    const expense = await Expense.find({ user: req.user }).populate('date');
    for (let i = 0; i < expense.length; i++) {
      data[expense[i].tag] = {
        amount: 0,
        type: expense[i].type,
      };
    }

    for (let i = 0; i < expense.length; i++) {
      let a = parseInt(expense[i].date.date.slice(3));
      if (a == today) {
        data[expense[i].tag].amount += parseInt(expense[i].amount);
      }
    }

    res.render('stats', {
      title: 'Statistics | Expense Tracker',
      data: data,
      monthData: monthData,
      link: 'Dashboard',
    });
  } catch (err) {
    console.log(err);
  }
};
