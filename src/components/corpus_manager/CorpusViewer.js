import React from 'react';
import { connect } from 'react-redux';

import Box from '@material-ui/core/Box';

import BodyScrollTable from '../common/BodyScrollTable';
import CorpusViewerBodyRow from './CorpusViewerBodyRow';
import CorpusViewerHeader from './CorpusViewerHeader';


function CorpusViewer(props) {
  const { corpusSize, currentPage, rowsPerPage, sortHeader, sortOrder,
          textList } = props;

  const start = currentPage * rowsPerPage;
  const end = start + rowsPerPage;

  const compareTexts = (a, b) => {
    if (a[sortHeader] < b[sortHeader]) {
      return sortOrder
    }
    else if (a[sortHeader] < b[sortHeader]) {
      return -sortOrder
    }
    else {
      return 0;
    }
  };

  const bodyRows = textList.slice().sort(compareTexts).slice(start, end).map(item => {
    return (<CorpusViewerBodyRow text={item} />);
  });

  return (
    <Box
      display="flex"
      flexGrow={1}
      height={'100%'}
      m={0}
      width={1}
    >
      <BodyScrollTable
        bodyCount={corpusSize}
        bodyRows={bodyRows}
        headerRow={<CorpusViewerHeader />}
        initialRowsPerPage={10}
        onPageChange={() => {}}
        rowsPerPageLabel="Rows Per Page:"
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </Box>
  );
}


CorpusViewer.propTypes = {

};


function mapStateToProps(state) {
  return {
    corpusSize: state.corpus.availableTexts.length,
    currentPage: state.pagination.currentPage,
    rowsPerPage: state.pagination.rowsPerPage,
    sortHeader: state.pagination.sortHeader,
    sortOrder: state.pagination.sortOrder
  };
}


export default connect(mapStateToProps)(CorpusViewer);