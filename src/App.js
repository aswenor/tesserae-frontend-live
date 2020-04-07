import React, { Component } from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Box from '@material-ui/core/Box';

import NavBar from './components/common/NavBar';
import Search from './components/search/';
import theme from './theme';

class App extends Component {
  render() {
    const routes = [
      {link: "/", name: "Search"}
    ]

    return (
      <Router>
        <NavBar routes={routes} />

        <Switch>
          <Route path="/" exact component={Search} />
        </Switch>
      </Router>
    );
  }
}

export default App;
