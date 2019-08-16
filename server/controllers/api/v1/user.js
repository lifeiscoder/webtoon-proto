const router = require("express").Router();
const User = require("../../../models/user");
const password = require("../../../helpers/password");
const regId = new RegExp("^[a-zA-Z0-9]{4,20}");
const regPwd = new RegExp(
  "^[a-zA-Z0-9^[a-zA-Z0-9!@#$%^&*()-=_+`~?/,.<>]{8,20}"
);

router.post("/donate", (req, res) => {
  if (!req.session.uid) {
    return res.status(401).send("you're not logged.");
  } else if (!req.body || !req.body.money) {
    return res.status(400).send("Bad request");
  }

  if (isNaN(req.body.money)) {
    return res.status(400).json({
      result: "FAIL",
      msg: "Money is not a number."
    });
  }

  User.findOne({ id: req.session.uid }, (err, user) => {
    if (err || !user) {
      return res.status(500).send("Server Internal Error");
    }

    if (user.money < req.body.money) {
      return res
        .status(200)
        .json({ result: "FAIL", msg: "기부할 돈이 부족합니다." });
    }

    User.updateOne(
      { id: req.session.uid },
      {
        $inc: {
          money: -req.body.money
        }
      },
      (err, raw) => {
        if (err) {
          return res.status(500).send("Server Internal Error");
        } else {
          return res.status(200).json({ result: "OK" });
        }
      }
    );
  });
});

router.post("/charge", (req, res) => {
  if (!req.session.uid) {
    return res.status(401).send("you're not logged.");
  } else if (!req.body || !req.body.money) {
    return res.status(400).send("Bad request");
  }

  if (isNaN(req.body.money)) {
    return res.status(400).json({
      result: "FAIL",
      msg: "Money is not a number."
    });
  }

  User.updateOne(
    { id: req.session.uid },
    {
      $inc: {
        money: req.body.money
      }
    },
    (err, raw) => {
      if (err) {
        return res.status(500).send("Server Internal Error");
      } else {
        return res.status(200).json({ result: "OK" });
      }
    }
  );
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  return res.redirect("/");
});

router.get("/", (req, res) => {
  if (!req.session.uid) {
    return res.status(401).send("you're not logged.");
  }

  User.findOne({ id: req.session.uid })
    .select("-password")
    .exec((err, user) => {
      if (err || !user) {
        return res.status(500).json({
          result: "FAIL",
          msg: "유저정보를 가져오는데 실패했습니다."
        });
      }

      return res.status(200).json({
        result: "OK",
        data: user
      });
    });
});

router.post("/login", (req, res) => {
  if (req.body && req.body.id && req.body.passwd) {
    const id = req.body.id.trim();
    const passwd = req.body.passwd.trim();

    return new Promise((resolve, reject) => {
      if (!regId.test(id)) {
        reject("잘못된 아이디 형식입니다.");
      }

      if (!regPwd.test(passwd)) {
        reject("잘못된 비밀번호 형식입니다.");
      }

      User.findOne({ id }, (err, user) => {
        if (err || !user) {
          reject("존재하지 않는 계정입니다.");
        } else {
          password.comparePassword(passwd, user.password).then(same => {
            if (same) {
              req.session.uid = user.id;
              resolve("로그인 성공");
            } else {
              reject("비밀번호가 틀렸습니다.");
            }
          });
        }
      });
    })
      .then(msg => {
        return res.status(200).json({
          result: "OK",
          msg
        });
      })
      .catch(msg => {
        return res.status(200).json({
          result: "FAIL",
          msg
        });
      });
  }
});

router.post("/join", (req, res) => {
  if (req.body && req.body.id && req.body.passwd) {
    const id = req.body.id.trim();
    const passwd = req.body.passwd.trim();

    return new Promise((resolve, reject) => {
      if (!regId.test(id)) {
        reject("아이디는 4~20글자(영문|숫자)이어야 합니다.");
      }

      if (!regPwd.test(passwd)) {
        reject("비밀번호는 8~20글자(영문|숫자|특수문자)이어야 합니다.");
      }

      User.findOne({ id }).exec((err, res) => {
        if (err) {
          console.error(err);
          reject("서버내에 오류가 있습니다.");
          return;
        }

        if (res) {
          reject("아이디가 이미 존재합니다.");
        } else {
          password
            .cryptPassword(passwd)
            .then(encryptedPasswd => {
              User.create({
                id,
                password: encryptedPasswd
              }).then(doc => {
                resolve("회원가입 성공");
              });
            })
            .catch(err => {
              console.error(err);
              reject("Server Internal Error");
            });
        }
      });
    })
      .then(msg => {
        return res.status(200).json({
          result: "OK",
          msg
        });
      })
      .catch(msg => {
        return res.status(200).json({
          result: "FAIL",
          msg
        });
      });
  } else {
    return res.status(400).send("Bad Request");
  }
});

module.exports = router;
