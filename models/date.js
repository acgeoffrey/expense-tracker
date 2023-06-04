const mongoose = require('mongoose');

const dateSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    //Include all the expenses for this date in an array
    expenses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense',
      },
    ],
    totalExpense: {
      type: Number,
      default: 0,
    },
    totalIncome: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Dates = mongoose.model('Dates', dateSchema);
module.exports = Dates;
