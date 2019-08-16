import React from "react";
import "./WebtoonRankingPage.css";
import { ISOToKoreanTime } from "../../helper/date-util";

export default class WebtoonRankingPage extends React.Component {
  _loadWebtoonRanking() {
    fetch("/api/v1/wt/webtoonranking/20").then(res => {
      if (res.status === 200) {
        res.json().then(rst => {
          if (rst.result === "OK") {
            let ranking = rst.data;
            this.setState({ ranking });
          }
        });
      }
    });
  }

  constructor() {
    super();

    this.state = {
      ranking: []
    };
  }

  componentDidMount() {
    this._loadWebtoonRanking();
  }

  _renderRanking() {
    const { ranking } = this.state;

    return ranking.map((v, i) => {
      return (
        <div className="card mt-5" key={i}>
          <div className="card-body">
            <div className="card-title">
              {ISOToKoreanTime(v.date)} 랭킹 현황
            </div>
            <hr />
            <div className="card-text">
              {v.list.map((v, i) => {
                return (
                  <div className="row" key={i}>
                    <div className="col-2">{i + 1}위</div>
                    <div className="col-auto">
                      <span className="badge badge-primary">{v}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="webtoon-ranking-container">
        <div className="row justify-content-center">
          <div className="col-10 col-sm-8 col-md-8 col-lg-8">
            {this._renderRanking()}
          </div>
        </div>
      </div>
    );
  }
}
