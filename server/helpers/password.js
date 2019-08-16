const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const cryptPassword = password => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, SALT_ROUNDS, (err, encryptedPassword) => {
      if (err) {
        reject(err);
      } else {
        resolve(encryptedPassword);
      }
    });
  });
};

const comparePassword = (plainPassword, hashedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, hashedPassword, (err, same) => {
      resolve(same);
    });
  });
};

module.exports = {
  cryptPassword,
  comparePassword
};
