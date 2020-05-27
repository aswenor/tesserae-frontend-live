/**
 * @fileoverview Main panel for the Tesserae search interface.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports Search
 * 
 * @requires NPM:react
 * @requires NPM:redux
 * @requires NPM:react-redux
 * @requires NPM:redux-thunk
 * @requires NPM:@material-ui/core
 * @requires ../LanguagesAppBar
 * @requires ../ReactivePanels
 * @requires ../../state_management/search
 */
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import Grid from '@material-ui/core/Grid';

import LanguagesAppBar from './LanguagesAppBar';
import PageContainer from '../common/PageContainer';
import ReactivePanels from './ReactivePanels';

import { searchReducer, DEFAULT_STATE } from '../../state_management/search';


// Create the ReduxJS store using thunks to enable storing Promises in redux.
const middleware = [thunk];
const store = createStore(
  searchReducer,
  DEFAULT_STATE,
  applyMiddleware(...middleware));


/**
 * Container for the Tesserae search page managing UI elements.
 * 
 * @component
 * 
 * @example
 *   return <Search />
 */
function Search(props) {
  const { routes } = props;
  const [isOpen, setIsOpen] = useState(true);

  return (
    <main>
      <Provider store={store}>
        <PageContainer
          routes={routes}
          showLanguages
        >
          <ReactivePanels
            leftMinWidth={15}
            open={isOpen}
            rightMinWidth={35}
          />
        </PageContainer>
      </Provider>
    </main>
  );
}


export default Search;
