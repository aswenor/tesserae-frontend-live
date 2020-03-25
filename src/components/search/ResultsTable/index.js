import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/styles';
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


function ResultsTableHeader(props) {
  const { sortHeader, sortOrder, updateSortHeader, updateSortOrder } = props;
  const sortDirection = sortOrder === 1 ? 'asc' : 'desc';

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
          key="number"
          variant="head"
        >
        </TableCell>
        <TableCell
          align="center"
          key="source"
          onClick={() => handleSortUpdate('source_tag')}
          sortDirection={sortHeader === 'source_tag' ? sortDirection : false}
          variant="head"
        >
          <TableSortLabel
            active={sortHeader === 'source_tag'}
            direction={sortDirection}
          >
            Source
          </TableSortLabel>
        </TableCell>
        <TableCell
          align="center"
          key="target"
          onClick={() => handleSortUpdate('target_tag')}
          sortDirection={sortHeader === 'target_tag' ? sortDirection : false}
          variant="head"
        >
          <TableSortLabel
            active={sortHeader === 'target_tag'}
            direction={sortDirection}
          >
            Target
          </TableSortLabel>
        </TableCell>
        <TableCell
          align="center"
          key="matches"
          variant="head"
        >
          Matched On
        </TableCell>
        <TableCell
          align="center"
          key="score"
          onClick={() => handleSortUpdate('score')}
          sortDirection={sortHeader === 'score' ? sortDirection : false}
          variant="head"
        >
          <TableSortLabel
            active={sortHeader === 'score'}
            direction={sortDirection}
          >
            Score
          </TableSortLabel>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}


function ResultsTableBody(props) {
  const { results } = props;

  const bodyCells = results.map((item, idx) => {
    return (
      <TableRow
        hover
        tabIndex={-1}
        key={item.source_tag + item.target_tag + item.matched_features.join(', ')}
      >
        <TableCell variant="body">
          <Typography
            align="left"
          >
            {idx + 1}
          </Typography>
        </TableCell>
        <TableCell
          align="left"
          variant="body"
        >
          <Typography><b>{item.source_tag}</b>:</Typography>
          <Typography>{item.source_snippet}</Typography>
        </TableCell>
        <TableCell
          align="left"
          variant="body"
        >
          <Typography><b>{item.target_tag}</b>:</Typography>
          <Typography>{item.target_snippet}</Typography>
        </TableCell>
        <TableCell
          align="center"
          variant="body"
        >
          <Typography>
            {item.matched_features.join(', ')}
            </Typography>
        </TableCell>
        <TableCell
          align="right"
          variant="body"
        >
          <Typography>
            {Math.round(item.score)}
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
            <Table>
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
