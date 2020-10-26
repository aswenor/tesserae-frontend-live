import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CorpusViewerSidebar from './CorpusViewerSidebar';
import CorpusViewer from './CorpusViewer';
import HorizontalResizePanels from '../common/HorizontalResizePanels';
import PageContainer from '../common/PageContainer';


function filterText(text, filter) {
  let typeFilter = true;
  if (filter.type.toLowerCase() !== 'all') {
    const isProse = filter.type === 'prose';
    typeFilter = isProse === text.is_prose;
  }

  const authorFilter = (
    filter.author === '' ||
    text.author.toLowerCase().search(filter.author) >= 0);
  const titleFilter = (
    filter.title === '' ||
    text.title.toLowerCase().search(filter.title) >= 0);
  const yearFilter = (
    filter.year !== undefined &&
    (text.year >= filter.year[0] || text.year <= filter.year[1])
  );

  return (typeFilter && authorFilter && titleFilter && yearFilter);
}


function CorpusManager(props) {
  const { availableTexts, routes } = props;

  const [ filter, setFilter ] = useState({
    type: 'all',
    author: '',
    title: '',
    year: [-10000000, 100000000]
  });

  const [isOpen, setIsOpen] = useState(true);

  const textList = availableTexts.filter(item => filterText(item, filter));

  return (
    <main>
      <PageContainer
        routes={routes}
        showLanguages
        toggleSideBar={(event) => setIsOpen(prevOpen => !prevOpen)}
      >
        <HorizontalResizePanels
          leftChild={
            availableTexts.length > 0
             ?  <CorpusViewerSidebar
                  filter={filter}
                  setFilter={setFilter}
                  show={availableTexts.length > 0}
                />
             : <div></div>
            
          }
          leftMinWidth={20}
          open={isOpen}
          rightChild={<CorpusViewer textList={textList} />}
          rightMinWidth={35}
        />
      </PageContainer>
    </main>
  );
}


function mapStateToProps(state) {
  return {
    availableTexts: state.corpus.availableTexts
  }
}


export default connect(mapStateToProps)(CorpusManager);