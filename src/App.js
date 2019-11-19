import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route, Link } from "react-router-dom"

import NavBar from './components/common/NavBar';
import SearchPrototypeA from './components/search/SearchPrototypeA';

const Index = () => <h2>Home</h2>;

class App extends Component {
  render() {
    const routes = [
      {link: "/", name: "Home"},
      {link: "/searcha", name: "SearchPrototypeA"},
      //{link: "/about", name: "SearchB"}
    ]

    return (
      <Router>
        <div className="App">
          <NavBar routes={routes} />
          <Route path="/" exact component={Index} />
          <Route path="/searcha" component={SearchPrototypeA} />
        </div>
      </Router>
    );
  }
}

export default App;
