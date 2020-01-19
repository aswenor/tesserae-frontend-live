import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route, Link } from "react-router-dom"

import NavBar from './components/common/NavBar';
import SearchPrototypeD from './components/search/SearchPrototypeD';

const Index = () => <h2>Home</h2>;

class App extends Component {
  render() {
    const routes = [
      {link: "/", name: "Search"}
    ]

    return (
      <Router>
        <div className="App">
          <NavBar routes={routes} />
          <Route path="/" exact component={SearchPrototypeD} />
        </div>
      </Router>
    );
  }
}

export default App;
