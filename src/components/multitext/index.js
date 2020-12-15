import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import PageContainer from '../common/PageContainer';
import HorizontalResizePanels from '../common/HorizontalResizePanels';
import MultitextResultsTable from './MultitextResultsTable';
import MultitextParametersLeft from './MultitextParametersLeft';
import OpenSidebarButton from '../common/OpenSidebarButton';

import { fetchTexts } from '../../api/corpus';


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
      >
        <OpenSidebarButton
          handleClose={(event) => setIsOpen(true)}
          open={!isOpen}
        />
        <HorizontalResizePanels
          leftChild={
            <MultitextParametersLeft
              toggleSideBar={(event) => setIsOpen(prevOpen => !prevOpen)}
            />
          }
          leftMinWidth={25}
          open={isOpen}
          rightChild={<MultitextResultsTable />}
          rightMinWidth={35}
        />
      </PageContainer>
    </main>
  );
}


function mapStateToProps(state) {
  return {
    language: state.corpus.language,
    shouldFetch: state.corpus.language !== '' && state.async.asyncPending < state.async.maxAsyncPending
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchTexts: fetchTexts
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Multitext);