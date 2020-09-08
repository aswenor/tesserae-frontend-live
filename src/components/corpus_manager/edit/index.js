import React, { useState } from 'react';

import EditForm from './EditForm';
import EditFormSidebar from './EditFormSidebar';
import HorizontalResizePanels from '../../common/HorizontalResizePanels';
import PageContainer from '../../common/PageContainer';


function CorpusEditor(props) {
  const { routes } = props;

  const [ selectedText, setSelectedText ] = useState({
    author: '',
    is_prose: true,
    title: '',
    year: ''
  });
  
  const [isOpen, setIsOpen] = useState(true);

  return (
    <main>
      <PageContainer
        routes={routes}
        toggleSideBar={(event) => setIsOpen(prevOpen => !prevOpen)}
      >
        <HorizontalResizePanels
          leftChild={
            <EditFormSidebar
              selectedText={selectedText}
              setSelectedText={setSelectedText}
            />
          }
          leftMinWidth={20}
          open={isOpen}
          rightChild={
            <EditForm
              selectedText={selectedText}
            />}
          rightMinWidth={35}
        />
      </PageContainer>
    </main>
  );
}


export default CorpusEditor;