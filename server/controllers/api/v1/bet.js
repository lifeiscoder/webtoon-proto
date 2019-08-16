const router = require("express").Router();
const User = require("../../../models/user");

router.get("/betlist/:num", (req, res) => {
  const { num } = req.params;

  if (!req.session.uid) {
    return res.status(401).send("you're not logged.");
  } else if (!num || isNaN(num)) {
    return res.status(400).send("Bad request");
  }

  User.findOne({
    id: req.session.uid
  })
    .select("+betlist")
    .exec((err, user) => {
      if (err || !user) {
        return res.status(500).send("Server Internal Error");
      }

      const betlist =
        user.betlist.length <= num ? user.betlist : user.betlist.splice(num);

      return res.status(200).json({
        result: "OK",
        data: betlist
      });
    });
});

router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;

  if (!req.session.uid) {
    return res.status(401).send("you're not logged.");
  } else if (!id) {
    return res.status(400).send("Bad request");
  }

  User.updateOne(
    {
      id: req.session.uid
    },
    {
      $pull: {
        betlist: {
          _id: id
        }
      }
    },
    (err, raw) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Server Internal Error.");
      }

      return res.status(200).json({
        result: "OK"
      });
    }
  );
});

router.delete("/cancel/:id", (req, res) => {
  const { id } = req.params;

  if (!req.session.uid) {
    return res.status(401).send("you're not logged.");
  } else if (!id) {
    return res.status(400).send("Bad request");
  }

  let removableDate = new Date();
  removableDate.setHours(removableDate.getHours() + 6);

  User.findOne(
    {
      id: req.session.uid,
      "betlist._id": id,
      "betlist.targetDate": {
        $gte: removableDate
      },
      "betlist.result": 0
    },
    {
      "betlist.$": 1
    }
  ).then(v => {
    if (v && v.betlist && v.betlist.length > 0) {
      User.updateOne(
        {
          id: req.session.uid
        },
        {
          $inc: {
            money: v.betlist[0].bettingMoney
          },
          $pull: {
            betlist: {
              _id: id
            }
          }
        },
        (err, raw) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Server Internal Error.");
          }

          if (raw.n > 0) {
            return res.status(200).json({
              result: "OK"
            });
          } else {
            return res.status(404).send("not found");
          }
        }
      );
    } else {
      return res.status(404).send("not found");
    }
  });
});

router.post("/", (req, res) => {
  const { money, ranking, bettingType } = req.body;

  if (!req.session.uid) {
    return res.status(401).send("you're not logged.");
  } else if (
    money === undefined ||
    ranking === undefined ||
    bettingType === undefined ||
    !Array.isArray(ranking) ||
    (ranking.length < 5 || ranking.lnegth > 10) ||
    (bettingType !== 6 && bettingType !== 12 && bettingType !== 24) ||
    isNaN(money) ||
    money < 1000
  ) {
    return res.status(400).send("Bad request");
  }

  User.findOne({ id: req.session.uid }, (err, user) => {
    if (err || !user) {
      return res.status(500).send("Server Internal Error");
    }

    if (money > user.money) {
      return res.status(200).json({
        result: "FAIL",
        msg: "돈이 부족합니다."
      });
    }

    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() + bettingType);

    const betInfo = {
      ranking,
      targetDate,
      bettingMoney: money
    };

    User.updateOne(
      { id: req.session.uid },
      {
        $inc: {
          money: -money
        },
        $push: {
          betlist: {
            $each: [betInfo],
            $sort: { date: -1 }
          }
        }
      },
      (err, raw) => {
        if (err) {
          return res.status(500).send("Server Internal Error");
        }
        return res.status(200).json({ result: "OK" });
      }
    );
  });
});

module.exports = router;
