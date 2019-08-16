const ISOToKoreanTime = date => {
  return new Date(date).toLocaleString();
};

module.exports = {
  ISOToKoreanTime
};
