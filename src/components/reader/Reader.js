import React from 'react';
import { useParams } from 'react-router-dom';

import PageContainer from '../common/PageContainer';
import TextReader from './TextReader';


function Reader(props) {
  const textID = useParams().textID;
  
  return (
    <PageContainer>
      <TextReader textID={textID} />
    </PageContainer>
  );
}

export default Reader;