import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';

import NavBar from './components/common/NavBar';
import Search from './components/search/';

class App extends Component {
  render() {
    const routes = [
      {link: "/", name: "Search"}
    ]

    return (
      <React.Fragment>
        <CssBaseline />
        <Router>
          <NavBar routes={routes} />

          <Switch>
            <Route path="/" exact component={Search} />
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}

export default App;
