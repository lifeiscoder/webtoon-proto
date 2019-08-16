import React from "react";
import LoginPage from "./pages/LoginPage";
import BettingPage from "./pages/BettingPage";
import BetListPage from "./pages/BetListPage";
import WebtoonRankingPage from "./pages/WebtoonRankingPage";
import CashShopPage from "./pages/CashShopPage";
import Navbar from "./components/Navbar";
import { getUser } from "../helper/api-helper";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

export default class App extends React.Component {
  _login() {
    getUser()
      .then(user => {
        this.setState({
          isLogged: true,
          isLoaded: true
        });
      })
      .catch(err => {
        this.setState({
          isLoaded: true
        });
      });
  }

  constructor() {
    super();

    this.state = {
      isLogged: false,
      isLoaded: false
    };
  }

  componentDidMount() {
    this._login();
  }

  render() {
    if (!this.state.isLoaded) {
      return null;
    }

    return (
      <div>
        <Navbar isLogged={this.state.isLogged} />
        <Router>
          {this.state.isLogged ? (
            <Switch>
              <Route path="/betting" exact component={BettingPage} />
              <Route path="/betlist" exact component={BetListPage} />
              <Route
                path="/webtoon-ranking"
                exact
                component={WebtoonRankingPage}
              />
              <Route path="/cashshop" exact component={CashShopPage} />
              <Route component={BettingPage} />
            </Switch>
          ) : (
            <Route component={LoginPage} />
          )}
        </Router>
      </div>
    );
  }
}
