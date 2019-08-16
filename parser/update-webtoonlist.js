const webtoonParse = require("./lib/webtoon-parse");
const wtMongo = require("./lib/wt-mongo");

const updateWebtoonList = async () => {
  try {
    const webtoonList = {};

    for (let i = 0; i < 7; i++) {
      const dayName = webtoonParse.getDayName(i);
      const dayWebtoonList = await webtoonParse.getWebtoonNames(dayName);

      console.log(`processing ${dayName} webtoons...`);

      webtoonList[dayName] = dayWebtoonList;
    }

    console.log("updated webtoon list.");

    wtMongo.insertWebtoonList(webtoonList);
  } catch (e) {
    console.error(e);
  }
};

updateWebtoonList();
