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

import PageContainer from '../common/PageContainer';
import ReactivePanels from './ReactivePanels';


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
      <PageContainer
        routes={routes}
        showLanguages
        toggleSideBar={(event) => setIsOpen(prevOpen => !prevOpen)}
      >
        <ReactivePanels
          leftMinWidth={15}
          open={isOpen}
          rightMinWidth={35}
        />
      </PageContainer>
    </main>
  );
}


export default Search;
