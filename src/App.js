/**
 * @fileoverview Container for the entire Tesserae app.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports App
 * 
 * @requires NPM:react
 * @requires NPM:react-router-dom
 * @requires ./components/common/NavBar/index.js:NavBar
 * @requires ./components/search/index.js:Search
 */

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import NavBar from './components/common/NavBar';
import Search from './components/search/';

/**
 * Global container for routing and content presentation.
 * 
 * @component
 * @example
 *   return <App />;
 */
function App(props) {
  /**
   * Routes to different pages in the Tesserae application.
   * 
   * @field {string} link The URL path to the page.
   * @field {string} name The name of the page being linked.
   * 
   */
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

export default App;
