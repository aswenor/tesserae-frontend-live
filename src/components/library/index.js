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

import LibraryTable from './LibraryTable';
import PageContainer from '../common/PageContainer';


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
      <PageContainer
        routes={routes}
        showLanguages
        sideBarOpen={isOpen}
        toggleOpen={(event) => setIsOpen(prevOpen => !prevOpen)}
      >
        <LibraryTable />
      </PageContainer>
    </main>
  );
}


export default Library;
