import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';

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
  const { count, initialRowsPerPage, onPageChange, pagination,
          resetPagination, rowsPerPageLabel, rowsPerPageOptions,
          updatePagination } = props;
  
  const classes = useStyles();

  useEffect(() => {
    updatePagination({
      currentPage: 0,
      rowsPerPage: initialRowsPerPage
    });
  }, [initialRowsPerPage, updatePagination]);

  useEffect(() => {
    if (onPageChange) {
      onPageChange(pagination);
    }
  }, [onPageChange, pagination, resetPagination]);

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
      page={pagination.currentPage}
      rowsPerPage={pagination.rowsPerPage}
      rowsPerPageOptions={rowsPerPageOptions}
    />
  );
}


TesseraeTablePagination.propTypes = {
  pagination: PropTypes.shape({

  }),
  updatePagination: PropTypes.func
};


function mapStateToProps(state) {
  return {
    pagination: state.pagination
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    resetPagination: resetPagination,
    updatePagination: updatePagination
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(TesseraeTablePagination);