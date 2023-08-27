const User = require('../models/user');
const Expense = require('../models/expense');
const Dates = require('../models/date');
const Month = require('../models/month');

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
        tag = req.body.tag.toLowerCase();
      } else if (req.body.type === 'credit') {
        tag = 'income';
      } else {
        tag = 'others';
      }

      let month = date.slice(3);
      let monthFind = await Month.find({ month: month, user: req.user });
      let months;
      let tagFound = false;
      if (monthFind.length === 0) {
        months = await Month.create({
          month: month,
          user: req.user,
          tags: [
            {
              name: tag,
              amount: req.body.amount,
            },
          ],
        });
        tagFound = true;
      } else {
        months = monthFind[0];
        months.tags.map((item) => {
          if (item.name == tag) {
            item.amount += parseFloat(req.body.amount);
            tagFound = true;
          }
        });
      }

      if (!tagFound) {
        months.tags.push({
          name: tag,
          amount: req.body.amount,
        });
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
        months.totalExpense += parseInt(req.body.amount);
      } else {
        dates.totalIncome += parseInt(req.body.amount);
        months.totalIncome += parseInt(req.body.amount);
      }
      dates.save();
      months.save();

      if (req.xhr) {
        return res.status(200).json({
          data: {
            newEntry: newExpense,
            totalExpense: dates.totalExpense,
          },
          message: 'New entry logged successfully!',
        });
      }

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

    let month = await Month.find({
      month: date.date.slice(3),
      user: req.user,
    });
    if (month) {
      month = month[0];
      month.tags.map((item) => {
        if (item.name == expense.tag) {
          item.amount -= parseFloat(expense.amount);
        }
      });
      if (expense.type == 'debit') {
        month.totalExpense -= parseFloat(expense.amount);
      } else {
        month.totalIncome -= parseFloat(expense.amount);
      }
    }

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
      month.save();

      if (req.xhr) {
        return res.status(200).json({
          data: {
            id: req.params.id,
          },
          message: 'Entry deleted',
        });
      }

      req.flash('success', 'Expense deleted!');
      return res.redirect('back');
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.stats = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      let date = new Date().toLocaleDateString('en-GB').split('/').join('-');
      let month = date.slice(3);

      let monthData = {
        deficit: 0,
        month:
          new Date().toLocaleString('default', { month: 'long' }) +
          ' ' +
          new Date().toLocaleDateString('en-GB').split('/').join('-').slice(6),
      };

      if (req.body.month) {
        month = req.body.month.split('-').reverse().join('-');
        monthData.month = new Date(req.body.month).toLocaleString('default', {
          month: 'long',
        });
        monthData.month += ' ' + req.body.month.slice(0, 4);
      }

      let months = await Month.find({ month: month, user: req.user });

      if (months.length > 0) {
        monthData.deficit = months[0].totalIncome - months[0].totalExpense;
      }

      res.render('stats', {
        title: 'Statistics | Expense Tracker',
        data: months,
        monthData: monthData,
        link: 'Dashboard',
      });
    } else {
      res.redirect('/');
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.getStats = async (req, res) => {
  try {
    if (req.isAuthenticated() && req.xhr) {
      let date = new Date().toLocaleDateString('en-GB').split('/').join('-');
      let month = date.slice(3);

      const months = await Month.find({ user: req.user, month: month });

      if (months.length === 0) {
        return res.status(204).json({
          message: 'No Data Found!',
        });
      }
      res.status(200).json({
        data: months[0].tags,
        message: 'Data fetched successfully!',
      });
    } else {
      res.status(401).json({
        message: 'You are not Authorized!',
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.exportAllData = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const expenses = await Expense.find({ user: req.user });

      res.status(200).json({
        status: 'success',
        expenses,
      });
    } else {
      res.status(401).json({
        message: 'You are not Authorized!',
      });
    }
  } catch (error) {
    console.log(error);
  }
};
