/**
 * @fileoverview Main panel viewing the available corpora.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports Library
 * 
 * @requires NPM:react
 * @requires NPM:redux
 * @requires NPM:react-redux
 * @requires NPM:redux-thunk
 * @requires NPM:@material-ui/core
 * @requires ../
 * @requires ./LibraryTable
 * @requires ../../state_management/library
 */
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import LibraryTable from './LibraryTable';
import PageContainer from '../common/PageContainer';

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
 *   return <Library />
 */
function Library(props) {
  const { routes } = props;
  const [isOpen, setIsOpen] = useState(true);

  return (
    <main>
      <Provider store={store}>
        <PageContainer
          routes={routes}
          showLanguages
          sideBarOpen={isOpen}
          toggleOpen={(event) => setIsOpen(prevOpen => !prevOpen)}
        >
          <LibraryTable />
        </PageContainer>
      </Provider>
    </main>
  );
}


export default Library;
