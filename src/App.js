import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route, Link } from "react-router-dom"

import NavBar from './global/NavBar';

const Index = () => <h2>Home</h2>;
const Match = () => <h2>Match</h2>;
const About = () => <h2>About</h2>;

class App extends Component {
  render() {
    const routes = [
      {link: "/", name: "Home"},
      {link: "/match", name: "Match"},
      {link: "/about", name: "About"}
    ]

    return (
      <Router>
        <div className="App">
          <NavBar routes={routes} />
          <Route path="/" exact component={Index} />
          <Route path="/match" component={Match} />
          <Route path="/about" component={About} />
        </div>
      </Router>
    );
  }
}

export default App;
