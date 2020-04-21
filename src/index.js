/**
 * @fileoverview Standardized styles and rendering for the Tesserae app.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * @version 1.0.0
 * 
 * @requires NPM:react
 * @requires NPM:react-dom
 * @requires NPM:@material-ui/core
 * @requires ./serviceWorker.js:serviceWorker
 * @requires ./App.js:App
 * @requires ./theme/index.js:theme
 */
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles'

import App from './App';
import theme from './theme';

/**
 * Render the React App to #root with a standard theme/styling.
 */
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);

// Hot reload for development mode so edits are rendered live.
if (module.hot) {
  module.hot.accept();
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
