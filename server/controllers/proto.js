const router = require("express").Router();
const path = require("path");

router.get("*", (req, res) => {
  return res.sendFile("index.html", {
    root: path.join(__dirname, "../public")
  });
});

module.exports = router;
