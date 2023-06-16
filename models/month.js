const mongoose = require('mongoose');

const monthSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    tags: [
      {
        name: String,
        amount: Number,
      },
    ],
    totalIncome: {
      type: Number,
      default: 0,
    },
    totalExpense: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Month', monthSchema);
