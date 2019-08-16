import React from "react";
import "./BetListPage.css";
import { ISOToKoreanTime } from "../../helper/date-util";

export default class BetListPage extends React.Component {
  _deleteBet() {
    fetch(`/api/v1/bet/delete/${this.state.selectedBetId}`, {
      method: "delete",
      body: JSON.stringify({
        id: this.state.selectedBetId
      })
    }).then(res => {
      if (res.status === 200) {
        this._loadBetlist();
        alert("배팅내역이 삭제되었습니다.");
      } else {
        alert("서버와의 통신이 원활하지 않습니다. 잠시 후 다시 이용해주세요.");
      }
      $("#deleteBetModal").modal("hide");
    });
  }

  _cancelBet() {
    fetch(`/api/v1/bet/cancel/${this.state.selectedBetId}`, {
      method: "delete",
      body: JSON.stringify({
        id: this.state.selectedBetId
      })
    }).then(res => {
      if (res.status === 200) {
        this._loadBetlist();
        alert("배팅내역이 취소되었습니다.");
      } else {
        alert("배팅내역 취소에 실패했습니다. 시간 확인 후 다시 이용해주세요.");
      }
      $("#deleteBetModal").modal("hide");
    });
  }

  _setModal(id, modalType) {
    this.setState({
      selectedBetId: id,
      modalType
    });
  }

  _loadBetlist() {
    fetch("/api/v1/bet/betlist/20").then(res => {
      if (res.status === 200) {
        res.json().then(v => {
          if (v.result === "OK") {
            this.setState({
              betlist: v.data
            });
          } else {
            alert(v.msg);
          }
        });
      } else {
        alert("서버와의 통신이 불안정합니다. 잠시 후 다시 이용해주세요.");
      }
    });
  }

  _renderBetlist() {
    let removableBetTime = new Date();
    removableBetTime.setHours(removableBetTime.getHours() + 6);

    return this.state.betlist.map((v, i) => {
      return (
        <div className="card bet mt-5" key={i}>
          <div className="card-body">
            <div className="card-title">
              배팅 시간: {ISOToKoreanTime(v.date)}
            </div>
            <div className="card-title">
              당첨 기준 시간: {ISOToKoreanTime(v.targetDate)}
            </div>
            <div className="card-text">
              <hr />
              <div className="ranking-table">
                {v.ranking.map((wtName, rankingNum) => {
                  return (
                    <div className="row" key={rankingNum}>
                      <div className="col-2">예상 {rankingNum + 1}등</div>
                      <div className="col-auto">
                        <span className="badge badge-primary">{wtName}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <hr />
              <div className="card-text">
                <div>
                  <label>배팅금액:</label>
                  <span className="badge badge-info ml-2">
                    {v.bettingMoney} 원
                  </span>
                </div>
                <div>
                  <label>배당률:</label>
                  <span className="badge badge-secondary ml-2">
                    {Math.pow(1.2, v.ranking.length).toFixed(2)} 배
                  </span>
                </div>
                <div>
                  <label>적중금액:</label>
                  <span className="badge badge-secondary ml-2">
                    {(v.bettingMoney * Math.pow(1.2, v.ranking.length)).toFixed(
                      2
                    )}{" "}
                    원
                  </span>
                </div>
                <div>
                  <label>적중결과:</label>
                  <span
                    className={`badge badge-${
                      v.result === 0
                        ? "dark"
                        : v.result === 1
                        ? "success"
                        : "danger"
                    } ml-2`}
                  >
                    {v.result === 0
                      ? "진행중"
                      : v.result === 1
                      ? "적중"
                      : "미적중"}
                  </span>
                </div>
                {removableBetTime > new Date(v.targetDate) ? (
                  <button
                    type="button"
                    className="btn btn-secondary form-control col-6"
                    data-toggle="modal"
                    data-target="#deleteBetModal"
                    onClick={() => this._setModal(v._id, "delete")}
                  >
                    배팅삭제
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-danger form-control col-6"
                    data-toggle="modal"
                    data-target="#deleteBetModal"
                    onClick={() => this._setModal(v._id, "cancel")}
                  >
                    배팅취소
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  constructor() {
    super();

    this.state = {
      betlist: [],
      selectedBetId: null
    };
  }

  componentDidMount() {
    this._loadBetlist();
  }

  render() {
    return (
      <div className="betlist-container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-8 col-md-8 col-lg-8">
            {this._renderBetlist()}
          </div>
        </div>
        <div
          className="modal fade"
          id="deleteBetModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="deleteBetModal"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deleteBetModalLabel">
                  배팅
                  {this.state.modalType === "delete" ? "삭제" : "취소"}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {this.state.modalType === "delete"
                  ? "배팅내역을 삭제합니다. 배팅내역은 삭제 후 복구가 불가능하며, 배팅금액은 환불해드리지 않습니다."
                  : "배팅 취소는 당첨시간이 6시간이상 남았을 경우 가능합니다. 배팅을 취소하시겠습니까?"}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  닫기
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    this.state.modalType === "delete"
                      ? this._deleteBet()
                      : this._cancelBet();
                  }}
                >
                  {this.state.modalType === "delete" ? "삭제" : "취소"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
