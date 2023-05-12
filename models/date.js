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
  },
  {
    timestamps: true,
  }
);

const Date = mongoose.model('Date', dateSchema);
module.exports = Date;
