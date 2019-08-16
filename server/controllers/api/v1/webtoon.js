const router = require("express").Router();
const WebtoonList = require("../../../models/webtoonlist");
const WebtoonRanking = require("../../../models/webtoonranking");

router.get("/webtoonlist", (req, res) => {
  WebtoonList.findOne({})
    .sort({ date: -1 })
    .exec((err, wtlist) => {
      if (err) {
        return res.status(500).json({
          result: "FAIL"
        });
      }

      return res.status(200).json({
        result: "OK",
        data: wtlist
      });
    });
});

router.get("/webtoonranking/:numOfLimit", (req, res) => {
  if (req.params && req.params.numOfLimit) {
    WebtoonRanking.find({})
      .sort({ date: -1 })
      .limit(parseInt(req.params.numOfLimit))
      .exec((err, wtRanks) => {
        if (err) {
          return res.status(500).json({
            result: "FAIL"
          });
        }

        return res.status(200).json({
          result: "OK",
          data: wtRanks
        });
      });
  } else {
    return res.status(400).send("Bad request");
  }
});

module.exports = router;
