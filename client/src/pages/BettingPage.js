import React from "react";
import "./BettingPage.css";
import { getUser } from "../../helper/api-helper";

export default class BettingPage extends React.Component {
  _submitBetting(bettingType) {
    if (this.state.dividendMoney < 1000) {
      alert("배팅금액은 최소 1000원 이상입니다.");
      return;
    } else if (this.state.expectationRanking.length < 5) {
      alert("최소 5순위 이상 맞춰주셔야합니다.");
      return;
    }

    fetch("/api/v1/bet/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        money: this.state.dividendMoney,
        ranking: this.state.expectationRanking,
        bettingType
      })
    })
      .then(res => {
        if (res.status === 200) {
          res.json().then(v => {
            if (v.result === "OK") {
              alert("정상적으로 배팅신청이 되었습니다.");
              window.location.reload();
            } else {
              alert(v.msg);
            }
          });
        } else {
          alert(
            "서버와의 통신이 원활하지 않습니다. 잠시 후 다시 이용해주세요."
          );
        }
      })
      .catch(err => {
        alert("서버와의 통신이 원활하지 않습니다. 잠시 후 다시 이용해주세요.");
      });
  }

  _getMoney() {
    getUser().then(user => {
      this.setState({
        isLoaded: true,
        myMoney: user.money
      });
    });
  }

  _calculateDividendRate() {
    const { expectationRanking } = this.state;
    let dividendRate = 1;

    for (let i = 0; i < expectationRanking.length; i++) {
      dividendRate *= 1.2;
    }

    return dividendRate;
  }

  _appendWebtoon(webtoonName) {
    const { expectationRanking } = this.state;

    if (expectationRanking.length > 9) {
      alert("더 이상 목록에 추가할 수 없습니다.");
      return;
    }

    expectationRanking.push(webtoonName);

    this.setState({
      expectationRanking,
      dividendRate: this._calculateDividendRate()
    });
  }

  _removeWebtoon(idx) {
    let { expectationRanking } = this.state;
    expectationRanking.splice(idx, 1);

    this.setState({
      expectationRanking,
      dividendRate: this._calculateDividendRate()
    });
  }

  _renderExpectationRanking() {
    const { expectationRanking } = this.state;

    return (
      <div className="expectation-ranking">
        {[0, 1, 2, 3, 4].map((v, i) => {
          return (
            <div className="row" key={i}>
              <div className="col-2">{i + 1}등</div>
              <div className="col-auto">
                {expectationRanking.length > i ? (
                  <span
                    className="badge badge-primary ranking-em"
                    onClick={() => this._removeWebtoon(i)}
                  >
                    {expectationRanking[i]}
                  </span>
                ) : (
                  <span className="badge badge-danger">비어있음</span>
                )}
              </div>
              <div className="col-2">{i + 6}등</div>
              <div className="col-auto">
                {expectationRanking.length > i + 5 ? (
                  <span
                    className="badge badge-primary ranking-em"
                    onClick={() => this._removeWebtoon(i)}
                  >
                    {expectationRanking[i + 5]}
                  </span>
                ) : (
                  <span className="badge badge-danger">비어있음</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  _renderWebtoons() {
    const { webtoons } = this.state;

    return webtoons.map((wt, i) => {
      return (
        <div className="card mt-5" key={i}>
          <div className="card-body">
            <div className="card-title">
              <b>
                <h3>{wt.title}</h3>
              </b>
            </div>
            <div className="card-body text-center">
              {wt.webtoonNameList.map((wtn, i) => {
                return (
                  <span
                    className="webtoon badge badge-light"
                    key={i}
                    onClick={() => {
                      this._appendWebtoon(wtn);
                    }}
                  >
                    <h4>{wtn}</h4>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      );
    });
  }

  _loadWebtoonList() {
    fetch("/api/v1/wt/webtoonlist").then(res => {
      if (res.status === 200) {
        res.json().then(rst => {
          if (rst.result === "OK") {
            let webtoons = rst.data;
            webtoons = Object.keys(webtoons.list).map((k, i) => {
              let title = null;

              switch (k) {
                case "sun":
                  title = "일요웹툰";
                  break;
                case "mon":
                  title = "월요웹툰";
                  break;
                case "tue":
                  title = "화요웹툰";
                  break;
                case "wed":
                  title = "수요웹툰";
                  break;
                case "thu":
                  title = "목요웹툰";
                  break;
                case "fri":
                  title = "금요웹툰";
                  break;
                case "sat":
                  title = "토요웹툰";
                  break;
              }

              if (title) {
                return {
                  title,
                  webtoonNameList: webtoons.list[k]
                };
              } else {
                return null;
              }
            });
            this.setState({
              webtoons
            });
          }
        });
      }
    });
  }

  constructor() {
    super();

    this.state = {
      expectationRanking: [],
      webtoons: [],
      dividendMoney: 0,
      dividendRate: 1,
      isLoaded: false,
      myMoney: 0
    };
  }

  componentDidMount() {
    this._loadWebtoonList();
    this._getMoney();
  }

  render() {
    const { isLoaded, dividendMoney, dividendRate, myMoney } = this.state;

    if (!isLoaded) {
      return null;
    }

    return (
      <div className="betting-container">
        <div className="row justify-content-center mt-5">
          <div className="col-10 col-sm-8 col-md-8 col-lg-8">
            <div className="card">
              <div className="card-body my-profile">
                <h5 className="card-title">내 정보</h5>
                <div className="card-text fs-09rem">
                  <label htmlFor="my_money">보유 금액:</label>
                  <span id="my_money" className="ml-2">
                    {myMoney.toFixed(2)}
                  </span>
                  원
                </div>
              </div>
              <hr />
              <div className="card-body">
                <h5 className="card-title">배팅 현황</h5>
                <div className="card-text fs-09rem">
                  <div className="betting-table text-center">
                    {this._renderExpectationRanking()}
                  </div>
                  <hr />
                  <div className="mt-5">
                    <label htmlFor="betting_money">배팅금액:</label>
                    <input
                      type="number"
                      id="betting_money"
                      className="form-control col-10 col-sm-6 col-md-4 col-lg-4"
                      onChange={e =>
                        this.setState({ dividendMoney: e.target.value })
                      }
                      value={dividendMoney}
                    />
                  </div>

                  <div className="mt-2">
                    <label htmlFor="dividend_rate">배당률:</label>
                    <span
                      id="dividend_rate"
                      className="badge badge-secondary ml-2"
                    >
                      {dividendRate.toFixed(2)} 배
                    </span>
                  </div>
                  <div className="mt-2">
                    <label htmlFor="prize_money">적중금액:</label>
                    <span id="prize_money" className="badge badge-info ml-2">
                      {(dividendRate * dividendMoney).toFixed(2)} 원
                    </span>
                  </div>
                  <div className="mt-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-success mr-2"
                      onClick={() => this._submitBetting(6)}
                    >
                      6시간 후 배팅하기
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary mr-2"
                      onClick={() => this._submitBetting(12)}
                    >
                      12시간 후 배팅하기
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-dark mr-2"
                      onClick={() => this._submitBetting(24)}
                    >
                      24시간 후 배팅하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {this._renderWebtoons()}
          </div>
        </div>
      </div>
    );
  }
}
