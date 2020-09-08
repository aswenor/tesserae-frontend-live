import React, { useState } from 'react';

import IngestForm from './IngestForm';
import PageContainer from '../../common/PageContainer';


function CorpusIngester(props) {
  const { routes } = props;
  
  const [isOpen, setIsOpen] = useState(true);
  const [ activePage, setActivePage ] = useState('viewer');

  return (
    <main>
      <PageContainer
        routes={routes}
        showLanguages={false}
        toggleSideBar={(event) => setIsOpen(prevOpen => !prevOpen)}
      >
        <IngestForm />
      </PageContainer>
    </main>
  );
}


export default CorpusIngester;