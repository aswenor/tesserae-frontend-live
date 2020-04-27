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
import uniq from 'lodash/uniqBy';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { Typography } from '@material-ui/core';

import { fetchResultsAction,
         getSearchStatusAction,
         updateCurrentPageAction,
         updateRowsPerPageAction, 
         initiateSearchAction} from '../../../api/corpus';
import ResultsPlaceholder from '../ResultsPlaceholder';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '100%',
    width: '100%',
    padding: 0,
    margin: 0
  }
}));


const cellStyles = makeStyles(theme => ({
  numberCell: {
    width: '10%'
  },
  snippetCell: {
    width: '20%'
  },
  matchesCell: {
    width: '10%'
  },
}));


function ResultsTableHeader(props) {
  const { sortHeader, sortOrder, updateSortHeader, updateSortOrder } = props;
  const sortDirection = sortOrder === 1 ? 'asc' : 'desc';

  const classes = cellStyles();

  const handleSortUpdate = header => {
    const newSortHeader = header.toLowerCase();
    const newSortOrder = sortHeader === newSortHeader ? -sortOrder : -1;
    updateSortHeader(newSortHeader);
    updateSortOrder(newSortOrder);
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell
          align="center"
          className={classes.numberCell}
          key="number"
          variant="head"
        >
        </TableCell>
        <TableCell
          align="center"
          className={classes.snippetCell}
          key="source"
          onClick={() => handleSortUpdate('source_tag')}
          sortDirection={sortHeader === 'source_tag' ? sortDirection : false}
          variant="head"
        >
          <TableSortLabel
            active={sortHeader === 'source_tag'}
            direction={sortDirection}
          >
            <Typography variant="h6"><b>Source</b></Typography>
          </TableSortLabel>
        </TableCell>
        <TableCell
          align="center"
          className={classes.snippetCell}
          key="target"
          onClick={() => handleSortUpdate('target_tag')}
          sortDirection={sortHeader === 'target_tag' ? sortDirection : false}
          variant="head"
        >
          <TableSortLabel
            active={sortHeader === 'target_tag'}
            direction={sortDirection}
          >
            <Typography variant="h6"><b>Target</b></Typography>
          </TableSortLabel>
        </TableCell>
        <TableCell
          align="center"
          className={classes.matchesCell}
          key="matches"
          variant="head"
        >
          <Typography variant="h6"><b>Match Features</b></Typography>
        </TableCell>
        <TableCell
          align="center"
          className={classes.numberCell}
          key="score"
          onClick={() => handleSortUpdate('score')}
          sortDirection={sortHeader === 'score' ? sortDirection : false}
          variant="head"
        >
          <TableSortLabel
            active={sortHeader === 'score'}
            direction={sortDirection}
          >
            <Typography variant="h6"><b>Score</b></Typography>
          </TableSortLabel>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}


function ResultsTableBody(props) {
  const { results } = props;
  const classes = cellStyles();

  const bodyCells = results.map((item, idx) => {
    let source_snippet = [];
    let target_snippet = [];

    let source_snippet_tokens = item.source_snippet.split(' ');
    let target_snippet_tokens = item.target_snippet.split(' ');

    let source_indices = uniq(item.highlight.map(x => x[0])).sort();
    let target_indices = uniq(item.highlight.map(x => x[1])).sort();

    console.log(`${item.highlight}; ${source_indices}; ${target_indices}`);

    let start = 0;
    let end = null;
    let slice = null;
    let component = null;

    while (source_indices.length > 0) {
      end = source_indices.shift();
      if (end === 0) {
        end = 1;
      }
      slice = source_snippet_tokens.slice(start, end);
      // console.log(start, end, slice);
      source_snippet.push(
        <Typography
          color={slice.length > 1 ? 'textPrimary' : 'primary'}
          component="span"
          key={`${item.source_tag} ${start},${end}`}
        >
          {` ${slice.join(' ')}`}
        </Typography>
      );
      start = end;
    }

    start = 0;
    end = null;
    slice = null;
    component = null;

    while (target_indices.length > 0) {
      end = target_indices.shift();
      if (end === 0) {
        end = 1;
      }
      slice = target_snippet_tokens.slice(start, end);
      target_snippet.push(
        <Typography
          color={slice.length > 1 ? 'textPrimary' : 'primary'}
          component="span"
          key={`${item.target_tag} ${start},${end}`}
        >
          {` ${slice.join(' ')}`}
        </Typography>
      );
      start = end;
    }

    return (
      <TableRow
        hover
        tabIndex={-1}
        key={item.source_tag + item.target_tag + item.matched_features.join(', ')}
      >
        <TableCell
          className={classes.numberCell}
          variant="body"
        >
          <Typography
            align="left"
          >
            {idx + 1}
          </Typography>
        </TableCell>
        <TableCell
          align="left"
          className={classes.snippetCell}
          variant="body"
        >
          <Typography><b>{item.source_tag}</b>:</Typography>
            {source_snippet}
        </TableCell>
        <TableCell
          align="left"
          className={classes.snippetCell}
          size="small"
          style={{maxWidth: '10px'}}
          variant="body"
        >
          <Typography><b>{item.target_tag}</b>:</Typography>
            {target_snippet}
        </TableCell>
        <TableCell
          align="center"
          className={classes.matchesCell}
          size="small"
          style={{maxWidth: '1px'}}
          variant="body"
        >
          <Typography>
            {item.matched_features.join(', ')}
            </Typography>
        </TableCell>
        <TableCell
          align="center"
          className={classes.numberCell}
          variant="body"
        >
          <Typography>
            <b>{item.score > 10 ? Math.round(item.score) : 10}</b>
          </Typography>
        </TableCell>
      </TableRow>
    );
  });

  return (
    <TableBody>
      {bodyCells}
    </TableBody>
  );
}


function ResultsTable(props) {
  const { asyncPending, currentPage, fetchResults, getSearchStatus, initiateSearch, resultCount, results,
          rowsPerPage, searchID, searchParams, shouldFetchResults, shouldInitiateSearch,
          sourceText, status, stopwords, targetText, updateCurrentPage, updateRowsPerPage } = props;
  
  const [ sortHeader, setSortHeader ] = useState('score');
  const [ sortOrder, setSortOrder ] = useState(1);

  const classes = useStyles(props);

  const headerLabels = ['', 'Source', 'Target', 'Matched On', 'Score'];

  if (shouldInitiateSearch) {
    initiateSearch(sourceText, targetText, searchParams, stopwords, asyncPending);
  }

  const start = currentPage * rowsPerPage;
  const end = Math.min(start + rowsPerPage, results.length);

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

  return (
    <div className={classes.root}>
      { results.length === 0
        ? <ResultsPlaceholder />
        : <div>
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
            <TablePagination
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


const mapDispatchToProps = dispatch => bindActionCreators({
  initiateSearch: initiateSearchAction,
  fetchResults: fetchResultsAction,
  getSearchStatus: getSearchStatusAction,
  updateCurrentPage: updateCurrentPageAction,
  updateRowsPerPage: updateRowsPerPageAction
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(ResultsTable);
