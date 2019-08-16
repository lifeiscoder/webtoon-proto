const axios = require("axios");
const cheerio = require("cheerio");

const getDayName = dayNum => {
  switch (dayNum) {
    case 0:
      return "sun";
    case 1:
      return "mon";
    case 2:
      return "tue";
    case 3:
      return "wed";
    case 4:
      return "thu";
    case 5:
      return "fri";
    case 6:
      return "sat";
    default:
      return null;
  }
};

const getWebtoonNames = async dayName => {
  const URL = `https://comic.naver.com/webtoon/weekdayList.nhn?week=${dayName}`;

  let source = null;
  try {
    source = await axios.get(URL);
    source = source.data;
  } catch (e) {
    console.error(e);
    return null;
  }
  const $ = cheerio.load(source);
  const webtoonNames = [];

  await $("dt a").each((i, e) => {
    if ($(e).attr("title")) {
      webtoonNames.push($(e).attr("title"));
    }
  });

  return webtoonNames;
};

const getWebtoonRanking = async () => {
  const URL = "https://comic.naver.com/index.nhn";

  let source = null;
  try {
    source = await axios.get(URL);
    source = source.data;
  } catch (e) {
    console.error(e);
    return null;
  }
  const $ = cheerio.load(source);
  const ranking = [];

  await $("#realTimeRankFavorite li a").each((i, e) => {
    if ($(e).attr("title")) {
      ranking.push(
        $(e)
          .attr("title")
          .split("-")[0]
      );
    }
  });

  if (ranking.length < 10) {
    console.error("순위 정보가 잘 못 되었습니다.");
    console.error(ranking);
    return null;
  }

  return ranking;
};

module.exports = {
  getWebtoonNames,
  getWebtoonRanking,
  getDayName
};
