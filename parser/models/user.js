const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type: String,
    require: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  },
  money: {
    type: Number,
    default: 0
  },
  betlist: {
    type: [
      {
        ranking: {
          type: Object,
          required: true
        },
        bettingMoney: {
          type: Number,
          required: true
        },
        targetDate: {
          type: Date,
          required: true
        },
        result: {
          type: Number,
          default: 0
        },
        date: {
          type: Date,
          default: Date.now
        }
      }
    ],
    default: []
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("user", userSchema);

module.exports = User;
