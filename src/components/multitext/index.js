import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import PageContainer from '../common/PageContainer';
import HorizontalResizePanels from '../common/HorizontalResizePanels';
import MultitextResultsTable from './MultitextResultsTable';
import MultitextParametersForm from './MultitextParametersForm';

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