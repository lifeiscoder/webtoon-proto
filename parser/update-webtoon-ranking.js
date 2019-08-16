const webtoonParse = require("./lib/webtoon-parse");
const wtMongo = require("./lib/wt-mongo");

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

const updateWebtoonRanking = async () => {
  const webtoonRanking = await webtoonParse.getWebtoonRanking();
  wtMongo.insertWebtoonRanking(webtoonRanking);
  return webtoonRanking;
};

const getCurrentDate = () => {
  return new Date();
};

const getCurrentMinutes = () => {
  return getCurrentDate().getMinutes();
};

//updateWebtoonRanking();

const startUpdateScheduler = async () => {
  let delayMinutes = 60 - getCurrentMinutes();

  if (delayMinutes === 60) {
    delayMinutes = 0;
  }

  while (1) {
    console.log(`update after ${delayMinutes} minutes`);
    await sleep(1000 * 60 * delayMinutes);

    updateWebtoonRanking();
    console.log(`updated ${getCurrentDate().toLocaleString()}`);
    delayMinutes = 60;
  }
};

startUpdateScheduler();

// const getCurrentDate = () => {
//   const date = new Date();
//   return `${date.getFullYear()}${date.getMonth() +
//     1}${date.getDate()}${date.getHours()}${date.getMinutes()}`;
// };
