const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const webtoonListSchema = new Schema({
  list: {
    type: Object,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const WebtoonList = mongoose.model("WebtoonList", webtoonListSchema);

module.exports = WebtoonList;
