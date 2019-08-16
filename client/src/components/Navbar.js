import React from "react";

export default class Navbar extends React.Component {
  render() {
    let linkName = location.href.split("/")[3];
    if (linkName && linkName.length > 0) {
      linkName = linkName.split("?")[0];
    } else {
      linkName = "betting";
    }

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/">
          웹투로토
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            <li
              className={`nav-item ${linkName === "betting" ? "active" : ""}`}
            >
              <a className="nav-link" href="/betting">
                배팅
              </a>
            </li>
            <li
              className={`nav-item ${linkName === "betlist" ? "active" : ""}`}
            >
              <a className="nav-link" href="/betlist">
                배팅내역
              </a>
            </li>
            <li
              className={`nav-item ${
                linkName === "webtoon-ranking" ? "active" : ""
              }`}
            >
              <a className="nav-link" href="/webtoon-ranking">
                웹툰랭킹
              </a>
            </li>
            <li
              className={`nav-item ${linkName === "cashshop" ? "active" : ""}`}
            >
              <a className="nav-link" href="/cashshop">
                충전/기부
              </a>
            </li>
          </ul>
          {this.props.isLogged ? (
            <div className="form-inline my-2 my-lg-0">
              <a
                className="btn btn-sm btn-outline-success my-2 my-sm-0"
                href="/api/v1/user/logout"
              >
                로그아웃
              </a>
            </div>
          ) : (
            ""
          )}
        </div>
      </nav>
    );
  }
}
