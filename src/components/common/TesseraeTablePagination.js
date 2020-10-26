import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';

import { fetchResults } from '../../api/search';
import TablePaginationActions from './TablePaginationActions';
import { updatePagination, resetPagination } from '../../state/pagination';


const useStyles = makeStyles(theme => ({
  root: {
    overflow: "hidden",
    width: '100%',
  }
}));


/**
 * Custom table pagination with results fetching on request.
 * 
 * @component
 */
function TesseraeTablePagination(props) {
  const { asyncReady, count, fetchResultsOnChange, fetchResults,
          initialRowsPerPage, page, resetPagination, rowsPerPage,
          rowsPerPageLabel, rowsPerPageOptions, searchID, sortHeader,
          sortOrder, updatePagination } = props;
  
  const classes = useStyles();

  console.log('RPP: ', rowsPerPage);

  useEffect(() => {
    updatePagination({
      currentPage: 0,
      rowsPerPage: initialRowsPerPage
    });
  }, [initialRowsPerPage, updatePagination]);

  useEffect(() => {
    if (fetchResultsOnChange) {
      fetchResults(searchID, asyncReady, page,
                   rowsPerPage, sortHeader, sortOrder);
    }
  }, [asyncReady, fetchResults, fetchResultsOnChange,
      page, rowsPerPage, resetPagination, searchID,
      sortHeader, sortOrder]);

  const handleChangePage = (event, newPage) => {
    updatePagination({currentPage: newPage});
  };

  const handleChangeRowsPerPage = (event) => {
    updatePagination({currentPage: 0, rowsPerPage: event.target.value});
  };

  return (
    <TablePagination
      ActionsComponent={TablePaginationActions}
      className={classes.root}
      count={count}
      labelRowsPerPage={rowsPerPageLabel}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      page={page}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={rowsPerPageOptions}
    />
  );
}


TesseraeTablePagination.propTypes = {
  count: PropTypes.number,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  updatePagination: PropTypes.func
};


function mapStateToProps(state) {
  return {
    asyncReady: state.async.asyncPending < state.async.maxAsyncPending,
    page: state.pagination.currentPage,
    rowsPerPage: state.pagination.rowsPerPage,
    searchID: state.search.searchID,
    sortHeader: state.pagination.sortHeader,
    sortOrder: state.pagination.sortOrder
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchResults: fetchResults,
    resetPagination: resetPagination,
    updatePagination: updatePagination
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(TesseraeTablePagination);