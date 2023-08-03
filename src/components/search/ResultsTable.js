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
import BodyScrollTable from '../common/BodyScrollTable';
import TesseraeTablePagination from '../common/TesseraeTablePagination';
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
  const { asyncReady, fetchResults, results, resultsCount, searchID,
          searchStatus, startIdx, sourceDivision, targetDivision } = props;

  const onPageChange = (pagination) => {
    fetchResults(searchID, asyncReady,
                 pagination.currentPage,
                 pagination.rowsPerPage,
                 pagination.sortHeader,
                 pagination.sortOrder);
  };

  console.log('results', results);

  if (searchStatus.toLowerCase() === 'done' && results.length === 0) {
    fetchResults(searchID, asyncReady);
  }

  /** CSS styles and global theme. */
  const classes = useStyles(props);

  // Create one row per result.
  const bodyRows = results.map((item, idx) => {
    return (
      <ResultsTableBody
        idx={startIdx + idx + 1}
        result={item}
        sourceDivision={sourceDivision}
        targetDivision={targetDivision}
      />
    );
  });

  // If a search has not been run and no results are available, display a
  // placeholder that points to the parameters form or shows a spinning
  // load bar. Otherwise, show the results.
  return (
    results.length === 0
      ? <ResultsPlaceholder />
      : <BodyScrollTable
          bodyCount={resultsCount}
          bodyRows={bodyRows}
          headerRow={<ResultsTableHeader />}
          initialRowsPerPage={100}
          onPageChange={onPageChange}
          rowsPerPageLabel="Results per page: "
          rowsPerPageOptions={[50, 100, 250, 500]}
        />
  );
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
  searchID: PropTypes.string,

  /**
   * Starting index of the current results page.
   */
  startIdx: PropTypes.number
}


/**
 * Add redux store state to this component's props.
 * 
 * @param {object} state The global state of the application.
 * @returns {object} Members of the global state to provide as props.
 */
const mapStateToProps = state => ({
  asyncReady: state.async.asyncPending < state.async.maxAsyncPending,
  results: state.search.results,
  resultsCount: state.search.resultsCount,
  searchID: state.search.searchID,
  searchStatus: state.search.searchStatus,
  startIdx: state.pagination.currentPage * state.pagination.rowsPerPage,
  sourceDivision: state.search.sourceDivision,
  targetDivision: state.search.sourceDivision
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
