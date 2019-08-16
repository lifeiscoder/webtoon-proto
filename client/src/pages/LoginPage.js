import React from "react";
import Navbar from "../components/Navbar";

export default class LoginPage extends React.Component {
  _submitJoin = () => {
    const id = this.state.joinId.trim();
    const pwd = this.state.joinPwd.trim();
    const pwd2 = this.state.joinPwd2.trim();

    if (!this.regId.test(id)) {
      alert("아이디는 4~20글자(영문|숫자)이어야 합니다.");
    } else if (pwd !== pwd2) {
      alert("두 비밀번호가 서로 다릅니다.");
    } else if (!this.regPwd.test(pwd)) {
      alert("비밀번호는 8~20글자(영문|숫자|특수문자)이어야 합니다.");
    } else {
      fetch("/api/v1/user/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id,
          passwd: pwd
        })
      }).then(rst => {
        if (rst.status === 200) {
          rst.json().then(v => {
            if (v.result === "OK") {
              alert("회원가입에 성공하셨습니다. 로그인을 해주세요.");
              this.setState({
                joinId: "",
                joinPwd: "",
                joinPwd2: ""
              });
            } else {
              alert(v.msg);
            }
          });
        } else {
          alert("서버와의 통신이 원활하지 않습니다.");
        }
      });
    }
  };

  _submitLogin = () => {
    const id = this.state.loginId.trim();
    const pwd = this.state.loginPwd.trim();

    fetch("/api/v1/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id,
        passwd: pwd
      })
    }).then(rst => {
      if (rst.status === 200) {
        rst.json().then(v => {
          if (v.result === "OK") {
            location.href = "/";
            this.setState({
              loginId: "",
              loginPwd: ""
            });
          } else {
            alert(v.msg);
          }
        });
      } else {
        alert("서버와의 통신이 원활하지 않습니다.");
      }
    });
  };

  constructor() {
    super();

    this.regId = new RegExp("^[a-zA-Z0-9]{4,20}");
    this.regPwd = new RegExp(
      "^[a-zA-Z0-9^[a-zA-Z0-9!@#$%^&*()-=_+`~?/,.<>]{8,20}"
    );

    this.state = {
      joinId: "",
      joinPwd: "",
      joinPwd2: "",
      loginId: "",
      loginPwd: ""
    };
  }

  render() {
    const { joinId, joinPwd, joinPwd2, loginId, loginPwd } = this.state;

    return (
      <div>
        <div className="login-container">
          <div className="row justify-content-center">
            <div className="col-8 col-sm-4 col-md-4 col-lg-4 text-center mt-5">
              <h1>회원가입</h1>
              <form>
                <div className="form-group">
                  <label htmlFor="join_id">아이디</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="아이디 입력"
                    onChange={e => {
                      this.setState({ joinId: e.target.value });
                    }}
                    value={joinId}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="join_id">비밀번호</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="새로운 비밀번호 입력"
                    onChange={e => {
                      this.setState({ joinPwd: e.target.value });
                    }}
                    value={joinPwd}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="join_id">비밀번호 확인</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="비밀번호 확인"
                    onChange={e => {
                      this.setState({ joinPwd2: e.target.value });
                    }}
                    value={joinPwd2}
                  />
                </div>
                <div className="form-group">
                  <button
                    type="button"
                    className="form-control btn btn-success"
                    onClick={() => {
                      this._submitJoin();
                    }}
                  >
                    회원가입
                  </button>
                </div>
              </form>
            </div>
            <div className="col-8 col-sm-4 col-md-4 col-lg-4 text-center mt-5">
              <h1>로그인</h1>
              <form>
                <div className="form-group">
                  <label htmlFor="join_id">아이디</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="아이디 입력"
                    onChange={e => {
                      this.setState({ loginId: e.target.value });
                    }}
                    value={loginId}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="join_id">비밀번호</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="비밀번호 입력"
                    onChange={e => {
                      this.setState({ loginPwd: e.target.value });
                    }}
                    value={loginPwd}
                  />
                </div>
                <div className="form-group">
                  <button
                    type="button"
                    className="form-control btn btn-primary"
                    onClick={() => {
                      this._submitLogin();
                    }}
                  >
                    로그인
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
