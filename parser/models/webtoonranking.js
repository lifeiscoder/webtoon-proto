const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const webtoonRankingSchema = new Schema({
  list: {
    type: Object,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const WebtoonRanking = mongoose.model("WebtoonRanking", webtoonRankingSchema);

module.exports = WebtoonRanking;
