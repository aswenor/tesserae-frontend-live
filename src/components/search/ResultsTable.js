/**
 * @fileoverview Table to display Tesserae search results.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports ResultsTable
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:redux
 * @requires NPM:react-redux
 * @requires NPM:@material-ui/core
 * @requires ../ResultsPlaceholder
 * @requires ../../api/corpus
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableContainer from'@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';

import ResultsPlaceholder from './ResultsPlaceholder';
import ResultsTableBody from './ResultsTableBody';
import ResultsTableHeader from './ResultsTableHeader';

import { fetchResults } from '../../api/search';
import { resetPagination, updatePagination } from '../../state/pagination';
import TablePaginationActions from '../common/TablePaginationActions';

/** CSS styles to apply to the component. */
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '100%',
    width: '100%',
    padding: 0,
    margin: 0
  },
  pagination: {
    borderTop: '2px solid black'
  }
}));


/**
 * Formatted table to display search results.
 * 
 * @component
 */
function ResultsTable(props) {
  const { asyncReady, currentPage, fetchResults, results, resultsCount,
          rowsPerPage, searchID, sortHeader, sortOrder, updatePagination } = props;

  console.log(searchID);

  // This is an alternative to useState that fires anytime state is updated.
  // The inner function is only fired when the table stops being rendered,
  // and is used to 
  useEffect(() => {
    console.log(searchID);
    return () => {
      resetPagination();
    }
  }, [searchID]);

  const handleTableChanges = (label, value) => {
    console.log(`fetching results from ${searchID}`);
    let newMeta = {[label]: value};
    
    if (label !== 'currentPage') {
      newMeta = {...newMeta, currentPage: 0}
    }

    updatePagination(newMeta);
    fetchResults(searchID, asyncReady, newMeta.currentPage,
                 newMeta.rowsPerPage, newMeta.sortHeader, newMeta.sortOrder);
  };

  /** CSS styles and global theme. */
  const classes = useStyles(props);

  /** Labels for the columns. */
  const headerLabels = ['', 'Source', 'Target', 'Matched On', 'Score'];

  /** Get the indices of results to display in the table. */
  const start = currentPage * rowsPerPage;
  const end = Math.min(start + rowsPerPage, resultsCount);

  let displayResults = results;

  if (results.length > rowsPerPage) {
    /** Get the results entries by sorting and slicing. */
    displayResults = results.sort((a, b) => {
      if (b[sortHeader] < a[sortHeader]) {
        return -1 * sortOrder;
      }
      else if (b[sortHeader] > a[sortHeader]) {
        return 1 * sortOrder;
      }
      else {
        return 0;
      }
    }).slice(start, end);
  }

  // If a search has not been run and no results are available, display a
  // placeholder that points to the parameters form or shows a spinning
  // load bar. Otherwise, show the results.
  return (
    <Box
      display="flex"
      flexGrow={1}
      height={'93%'}
      maxHeight={'93%'}
      width={1}
    >
      { results.length === 0
        ? <ResultsPlaceholder />
        : <div>
            <TableContainer
              className={classes.root}
            >
              <Table
                stickyHeader
              >
                <ResultsTableHeader
                  labels={headerLabels}
                  sortHeader={sortHeader}
                  sortOrder={sortOrder}
                  updateSortHeader={value => handleTableChanges('sortHeader', value)}
                  updateSortOrder={value => handleTableChanges('sortOrder', value)}
                />
                <ResultsTableBody 
                  results={displayResults}
                  startIdx={currentPage * rowsPerPage}
                />
              </Table>
            </TableContainer>
            <TablePagination
              ActionsComponent={TablePaginationActions}
              className={classes.pagination}
              count={resultsCount}
              labelRowsPerPage="Results per page:"
              onChangePage={handleTableChanges}
              onChangeRowsPerPage={(event) => handleTableChanges('rowsPerPage', event.target.value)}
              page={currentPage}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[50, 100, 200, 500]}
            />
          </div>
      }
    </Box>
  )
}


ResultsTable.propTypes = {
  /**
   * Whether or not an async request may be initiated.
   */
  asyncReady: PropTypes.bool,

  /**
   * The number of results returned byt this search.
   */
  resultsCount: PropTypes.number,

  /**
   * Array of search results retrieved frmo the REST API.
   */
  results: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * Pairs of source/target snippet token indices corresponding to matches.
       */
      highlight: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),

      /**
       * Database ID of the result.
       */
      object_id: PropTypes.string,

      /**
       * Score of the match.
       */
      score: PropTypes.number,

      /**
       * Matching passage of source text.
       */
      source_snippet: PropTypes.string,

      /**
       * Locus of matching passage of source text.
       */
      source_tag: PropTypes.string,

      /**
       * Matching passage of target text.
       */
      target_snippet: PropTypes.string,

      /**
       * Locus of matching passage of source text.
       */
      target_tag: PropTypes.string,
    })
  ),

  /**
   * Database ID of the search.
   */
  searchID: PropTypes.string
}


/**
 * Add redux store state to this component's props.
 * 
 * @param {object} state The global state of the application.
 * @returns {object} Members of the global state to provide as props.
 */
const mapStateToProps = state => ({
  asyncReady: state.async.asyncPending < state.async.maxAsyncPending,
  currentPage: state.pagination.currentPage,
  results: state.search.results,
  resultsCount: state.search.resultsCount,
  rowsPerPage: state.pagination.rowsPerPage,
  searchID: state.search.searchID,
  sortHeader: state.pagination.sortHeader,
  sortOrder: state.pagination.sortOrder,
});


/**
 * Add redux store actions to this component's props.
 * @param {function} dispatch The redux dispatch function.
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  fetchResults: fetchResults,
  resetPagination: resetPagination,
  updatePagination: updatePagination
}, dispatch);


// Do redux binding here.
export default connect(mapStateToProps, mapDispatchToProps)(ResultsTable);
