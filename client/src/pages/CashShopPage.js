import React from "react";
import "./CashShopPage.css";
import { getUser } from "../../helper/api-helper";

export default class CashShopPage extends React.Component {
  _submitCharging() {
    fetch("/api/v1/user/charge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        money: this.state.amountOfCharging
      })
    }).then(res => {
      if (res.status === 200) {
        res.json().then(rst => {
          if (rst.result === "OK") {
            alert("충전 되었습니다.");
            this._getMoney();
          } else {
            alert(rst.msg);
          }
        });
      } else {
        alert("서버에 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
      }
    });
  }

  _submitDonating() {
    fetch("/api/v1/user/donate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        money: this.state.amountOfDonating
      })
    }).then(res => {
      if (res.status === 200) {
        res.json().then(rst => {
          if (rst.result === "OK") {
            alert("기부 되었습니다.");
            this._getMoney();
          } else {
            alert(rst.msg);
          }
        });
      } else {
        alert("서버에 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
      }
    });
  }

  _getMoney() {
    getUser()
      .then(user => {
        this.setState({
          myMoney: user.money,
          isLoaded: true
        });
      })
      .catch(err => {
        alert("서버에 오류가 있습니다. 새로고침 후 이용해주세요.");
      });
  }

  constructor() {
    super();

    this.state = {
      myMoney: 0,
      amountOfCharging: 0,
      amountOfDonating: 0,
      isLoaded: false
    };
  }

  componentDidMount() {
    this._getMoney();
  }

  render() {
    const {
      isLoaded,
      amountOfCharging,
      amountOfDonating,
      myMoney
    } = this.state;
    if (!isLoaded) {
      return null;
    }

    return (
      <div className="cash-shop-container">
        <div className="row justify-content-center">
          <div className="col-10 col-sm-8 col-md-8 col-lg-8">
            <div className="card mt-5">
              <div className="card-body">
                <h5 className="card-title">내 정보</h5>
                <div className="card-text fs-09rem">
                  <label htmlFor="my_money">보유 금액:</label>
                  <span id="my_money" className="ml-2">
                    {myMoney.toFixed(2)}
                  </span>
                  원
                </div>
                <hr />
                <div className="card-title">충전소</div>
                <div className="card-text">
                  <label>충전금액</label>
                  <input
                    type="number"
                    className="form-control col-6"
                    value={amountOfCharging}
                    onChange={e =>
                      this.setState({ amountOfCharging: e.target.value })
                    }
                  />

                  <button
                    type="button"
                    className="btn btn-primary form-control col-6"
                    onClick={() => this._submitCharging()}
                  >
                    충전하기
                  </button>
                  <hr />
                  <label>기부금액</label>
                  <input
                    type="number"
                    className="form-control col-6"
                    value={amountOfDonating}
                    onChange={e =>
                      this.setState({ amountOfDonating: e.target.value })
                    }
                  />

                  <button
                    type="button"
                    className="btn btn-info form-control col-6"
                    onClick={() => this._submitDonating()}
                  >
                    기부하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
