const getUser = () => {
  return new Promise((resolve, reject) => {
    fetch("/api/v1/user/")
      .then(res => {
        if (res.status === 200) {
          res.json().then(rst => {
            if (rst.result === "OK") {
              resolve(rst.data);
            } else {
              reject("로그인이 필요합니다.");
            }
          });
        } else {
          reject("로그인이 필요합니다.");
        }
      })
      .catch(err => {
        reject(
          "서버와의 통신에 오류가 있습니다. 새로고침 후 다시 시도해주세요."
        );
      });
  });
};
module.exports = {
  getUser
};
