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
 * @requires ../../../api/corpus
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from'@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';

import { fetchResultsAction,
         getSearchStatusAction,
         updateCurrentPageAction,
         updateRowsPerPageAction, 
         initiateSearchAction } from '../../../api/corpus';
import ResultsPlaceholder from '../ResultsPlaceholder';
import ResultsTableBody from '../ResultsTableBody';
import ResultsTableHeader from '../ResultsTableHeader';


/** CSS styles to apply to the component. */
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '97%',
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
  const { asyncPending, currentPage, initiateSearch, results,
          rowsPerPage, searchParams, shouldInitiateSearch,
          sourceText, stopwords, targetText, updateCurrentPage,
          updateRowsPerPage } = props;
  
  /** Managers for UI sorting state. */
  const [ sortHeader, setSortHeader ] = useState('score');
  const [ sortOrder, setSortOrder ] = useState(1);

  /** CSS styles and global theme. */
  const classes = useStyles(props);

  /** Labels for the columns. */
  const headerLabels = ['', 'Source', 'Target', 'Matched On', 'Score'];

  // Kick off a search if all parameters are selected.
  if (shouldInitiateSearch) {
    initiateSearch(sourceText, targetText, searchParams, stopwords, asyncPending);
  }

  /** Get the indices of results to display in the table. */
  const start = currentPage * rowsPerPage;
  const end = Math.min(start + rowsPerPage, results.length);

  /** Get the results entries by sorting and slicing. */
  const displayResults = results.sort((a, b) => {
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

  // If a search has not been run and no results are available, display a
  // placeholder that points to the parameters form or shows a spinning
  // load bar. Otherwise, show the results.
  return (
    <div className={classes.root}>
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
                  updateSortHeader={setSortHeader}
                  updateSortOrder={setSortOrder}
                />
                <ResultsTableBody results={displayResults} />
              </Table>
            </TableContainer>
            <TablePagination
              className={classes.pagination}
              component="div"
              count={results.length}
              labelRowsPerPage="Results per page:"
              onChangePage={updateCurrentPage}
              onChangeRowsPerPage={updateRowsPerPage}
              page={currentPage}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[50, 100, 200, 500]}
            />
          </div>
      }
    </div>
  )
}


ResultsTable.propTypes = {
  /**
   * True if an AJAX request is in progress.
   */
  asyncPending: PropTypes.bool,

  /**
   * The current page of results to display.
   */
  currentPage: PropTypes.number,

  /**
   * Callback to kick off a search.
   */
  initiateSearch: PropTypes.func,

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
   * The number of results to show per table page.
   */
  rowsPerPage: PropTypes.number,

  /**
   * Selected parameters for the search.
   */
  searchParams: PropTypes.object,

  /**
   * True when parameters are selected and the user kicks off a search.
   */
  shouldInitiateSearch: PropTypes.bool,

  /**
   * The source text to use in the search.
   */
  sourceText: PropTypes.object,

  /**
   * List of words to ignore in the search.
   */
  stopwords: PropTypes.array,

  /**
   * The target text to use in the search.
   */
  targetText: PropTypes.object,

  /**
   * Callback to change the currently displayed page.
   */
  updateCurrentPage: PropTypes.func,

  /**
   * Callback to change the number of results displayed per page.
   */
  updateRowsPerPage: PropTypes.func
}


/**
 * Add redux store state to this component's props.
 * 
 * @param {object} state The global state of the application.
 * @returns {object} Members of the global state to provide as props.
 */
const mapStateToProps = state => ({
  asyncPending: state.asyncPending,
  currentPage: state.currentPage,
  pending: state.asyncPending,
  resultCount: state.resultCount,
  results: state.results,
  rowsPerPage: state.rowsPerPage,
  searchID: state.searchID,
  searchParams: state.searchParameters,
  shouldFetchResults: state.shouldFetchResults,
  shouldInitiateSearch: state.shouldInitiateSearch,
  sourceText: state.sourceText,
  stopwords: state.stopwords,
  status: state.status,
  targetText: state.targetText,
});


/**
 * Add redux store actions to this component's props.
 * @param {funciton} dispatch The redux dispatch function.
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  initiateSearch: initiateSearchAction,
  fetchResults: fetchResultsAction,
  getSearchStatus: getSearchStatusAction,
  updateCurrentPage: updateCurrentPageAction,
  updateRowsPerPage: updateRowsPerPageAction
}, dispatch);


// Do redux binding here.
export default connect(mapStateToProps, mapDispatchToProps)(ResultsTable);
