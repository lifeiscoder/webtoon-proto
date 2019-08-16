const webtoonParse = require("./lib/webtoon-parse");
const wtMongo = require("./lib/wt-mongo");

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function checkBet() {
  const ranking = await webtoonParse.getWebtoonRanking();
  const users = await wtMongo.getWaittingBetlist();
  const currentDate = new Date();

  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < users[i].betlist.length; j++) {
      const betlist = users[i].betlist[j];
      const targetDate = new Date(betlist.targetDate);

      if (targetDate <= currentDate) {
        const userRanking = betlist.ranking;
        let win = true;

        for (let k = 0; userRanking.length; k++) {
          if (userRanking[i] !== ranking[k]) {
            win = false;
            break;
          }
        }

        if (win) {
          wtMongo.checkBetResult(
            betlist["_id"],
            1,
            betlist["bettingMoney"],
            userRanking.length
          );
        } else {
          wtMongo.checkBetResult(betlist["_id"], 2);
        }
      }
    }
  }
}

async function start() {
  while (1) {
    console.log("checking...");
    await checkBet();
    console.log("finished checking.");

    await sleep(1000 * 30);
  }
}

start();
