import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { filter } from 'lodash';

import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';

import BodyScrollTable from '../common/BodyScrollTable';
import MultitextResultsPlaceHolder from './MultitextResultsPlaceholder';
import MultitextResultsTableHeader from './MultitextResultsTableHeader';
import MultitextResultsTableRow from './MultitextResultsTableRow';

import { fetchResults as fetchMultitext } from '../../api/multitext';
import { fetchResults } from '../../api/search'
import { updatePagination } from '../../state/pagination';


function MultitextResultsTable(props) {
  const { displayTable, fetchMultitext, fetchResults, multitextID,
          multitextResults, pagination, resultsCount, results,
          searchID, startIdx } = props;

  console.log('multitext results', multitextResults);
  console.log('pagination', pagination)

  useEffect(() => {
    if (searchID && multitextID) {
      (async () => {
        await fetchResults(searchID, true,
                           pagination.currentPage,
                           pagination.rowsPerPage,
                           pagination.sortHeader,
                           pagination.sortOrder
              );
      })().then(
        () => {
          fetchMultitext(multitextID, true,
                         pagination.currentPage,
                         pagination.rowsPerPage,
                         pagination.sortHeader,
                         pagination.sortOrder
          )});
    }
  }, [fetchMultitext, fetchResults, multitextID, pagination, searchID]);

  const bodyRows = multitextResults.map((item, idx) => {
    const match = item.match;
    const multimatches = item['cross-ref'];
    return (
      <MultitextResultsTableRow
        highlight={match.highlight}
        idx={startIdx + idx + 1}
        matched_features={match.matched_features}
        multiresults={multimatches}
        object_id={match.object_id}
        score={match.score}
        source_snippet={match.source_snippet}
        source_tag={match.source_tag}
        target_snippet={match.target_snippet}
        target_tag={match.target_tag}
      />
    );
  });

  return (
    <Box
      display="flex"
      flexGrow={1}
      height={'93%'}
      maxHeight={'93%'}
      width={1}
    >
      { !displayTable
        ? <MultitextResultsPlaceHolder />
        : <BodyScrollTable
            bodyCount={resultsCount}
            bodyRows={bodyRows}
            headerRow={<MultitextResultsTableHeader />}
            initialRowsPerPage={100}
            rowsPerPageLabel="Results per page:"
            rowsPerPageOptions={[50, 100, 250, 500]}
          />
      }
    </Box>
  );
}


MultitextResultsTable.propTypes = {
  displayTable: PropTypes.bool
};


function mapStateToProps(state) {
  return {
    displayTable: state.search.results.length > 0
                  && state.multitext.results.length > 0,
    pagination: state.pagination,
    results: state.search.results,
    resultsCount: state.search.resultsCount,
    multitextID: state.multitext.searchID,
    multitextResults: state.multitext.results,
    searchID: state.search.searchID,
    startIdx: state.pagination.currentPage * state.pagination.rowsPerPage
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchMultitext: fetchMultitext,
    fetchResults: fetchResults
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(MultitextResultsTable);