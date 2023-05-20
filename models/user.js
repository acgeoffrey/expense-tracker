const mongoose = require('mongoose');
const crypto = require('../config/crypto');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      get: crypto.decrypt,
      set: crypto.encrypt,
      required: true,
    },
    avatar: {
      type: String,
      get: crypto.decrypt,
      set: crypto.encrypt,
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
