const mongoose = require("mongoose");
const WebtoonList = require("../models/webtoonlist");
const WebtoonRanking = require("../models/webtoonranking");
const User = require("../models/user");

const DB_URL = "mongodb://localhost:27017/wtProto";

const connectDB = () => {
  mongoose.connect(DB_URL, { useNewUrlParser: true });

  const db = mongoose.connection;

  return new Promise((resolve, reject) => {
    db.on("error", err => reject(err));

    db.once("open", () => {
      resolve(db);
    });
  });
};

const insertWebtoonList = webtoonList => {
  connectDB()
    .then(db => {
      WebtoonList.create({ list: webtoonList })
        .then(() => {
          db.close();
        })
        .catch(err => {
          throw err;
        });
    })
    .catch(err => {
      console.error(err);
    });
};

const insertWebtoonRanking = webtoonList => {
  connectDB()
    .then(db => {
      WebtoonRanking.create({ list: webtoonList })
        .then(() => {
          db.close();
        })
        .catch(err => {
          throw err;
        });
    })
    .catch(err => {
      console.error(err);
    });
};

const getWaittingBetlist = () => {
  return new Promise((resolve, reject) => {
    connectDB()
      .then(db => {
        User.find(
          {},
          {
            betlist: {
              $elemMatch: {
                result: 0
              }
            }
          }
        )
          .then(users => {
            db.close();
            resolve(users);
          })
          .catch(err => {
            throw err;
          });
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
};
//db.users.update({betlist: {$elemMatch: {"bettingMoney": 1515}}}, {$set:{"betlist.$.bettingMoney": 200}});
const checkBetResult = (_id, result, bettingMoney = 0, rankingLength = 0) => {
  connectDB().then(db => {
    const updateQuery = {
      $set: {
        "betlist.$.result": result
      }
    };

    if (result === 1) {
      updateQuery["$inc"] = {
        money: bettingMoney * Math.pow(1.2, rankingLength)
      };
    }

    User.updateOne(
      {
        betlist: {
          $elemMatch: {
            _id
          }
        }
      },
      updateQuery
    ).then(() => {
      db.close();
    });
  });
};

module.exports = {
  insertWebtoonList,
  insertWebtoonRanking,
  getWaittingBetlist,
  checkBetResult
};
