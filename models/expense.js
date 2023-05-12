const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    date: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Date',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
