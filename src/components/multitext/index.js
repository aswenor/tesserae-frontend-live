import React, { useState } from 'react';

import PageContainer from '../common/PageContainer';
import HorizontalResizePanels from '../common/HorizontalResizePanels';
import MultitextResultsTable from './MultitextResultsTable';
import MultitextParametersForm from './MultitextParametersForm';


/**
 * Container for the Tesserae multitext search page managing UI elements.
 * 
 * @component
 * 
 * @example
 *   return <Multitext />
 */
function Multitext(props) {
  const { routes } = props;
  const [isOpen, setIsOpen] = useState(true);

  return (
    <main>
      <PageContainer
        routes={routes}
        showLanguages
        toggleSideBar={(event) => setIsOpen(prevOpen => !prevOpen)}
      >
        <HorizontalResizePanels
          leftChild={<MultitextParametersForm />}
          leftMinWidth={50}
          open={isOpen}
          rightChild={<MultitextResultsTable />}
          rightMinWidth={35}
        />
      </PageContainer>
    </main>
  );
}


export default Multitext;