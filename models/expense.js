const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    tag: {
      type: String,
    },
    type: {
      type: String,
    },
    notes: {
      type: String,
    },
    date: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dates',
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
