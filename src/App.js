/**
 * @fileoverview Container for the entire Tesserae app.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports App
 * 
 * @requires NPM:react
 * @requires NPM:react-router-dom
 * @requires NPM:redux
 * @requires NPM:react-redux
 * @requires NPM:redux-thunk
 * @requires NPM:lodash
 * @requires ./components/common/NavBar/index.js:NavBar
 * @requires ./components/search/index.js:Search
 */

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { sortBy } from 'lodash';

import { fetchLanguages, fetchTexts } from './api/corpus';
import routes from './routes';
import { DEFAULT_STATE, tesseraeReducer } from './state';


// Create the ReduxJS store using thunks to enable storing Promises in redux.
const middleware = [thunk];
const store = createStore(
  tesseraeReducer,
  DEFAULT_STATE,
  applyMiddleware(...middleware));


/**
 * Global container for routing and content presentation.
 * 
 * @component
 * @example
 *   return <App />;
 */
function App(props) {
  /**
   * Routes to different pages in the Tesserae application sorted by URL.
   * 
   * @field {string} link The URL path to the page.
   * @field {string} name The name of the page being linked.
   * 
   */
  const appRoutes = sortBy(routes.slice(), 'link').reverse().map(item => {
    return (
      <Route key={item.name} path={item.link} component={item.component} />
    );
  });

  // Automatically fetch available languages on app load.
  if (store.getState().corpus.availableLanguages.length === 0) {
    fetchLanguages(true)(store.dispatch);
  }

  // Automatically fetch texts on app load.
  if (store.getState().corpus.language !== '' &&
      store.getState().corpus.availableTexts.length === 0) {
    fetchTexts(store.getState().corpus.language, true)(store.dispatch);
  }

  // Wrap the app in the Redux context (Provider) and the Router.
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          {appRoutes}
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
