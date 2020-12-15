/**
 * @fileoverview More pagination options for large tables.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports TablePagination
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:lodash
 * @requires NPM:@material-ui/core
 * @requires NPM:@material-ui/icons
 */
import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';


const useStyles = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5)
  }
}));


function TablePaginationActions(props) {
  const { count, onChangePage, page, rowsPerPage } = props;

  const classes = useStyles();
  const theme = useTheme();

  const totalPages = Math.ceil(count / rowsPerPage) - 1;
  const prevPage = Math.max(page - 1, 0);
  const nextPage = Math.min(page + 1, totalPages);

  return (
    <span
      className={classes.root}
    >
      <IconButton
        aria-label="first page"
        disabled={page === 0}
        onClick={(event) => onChangePage(event, 0)}
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        aria-label="previous page"
        disabled={page === 0}
        onClick={(event) => onChangePage(event, prevPage)}
      >
        {theme.direction === 'rtl'
         ? <KeyboardArrowRightIcon />
         : <KeyboardArrowLeftIcon />
        }
      </IconButton>
      <IconButton
        aria-label="next page"
        disabled={page === totalPages}
        onClick={(event) => onChangePage(event, nextPage)}
      >
        {theme.direction === 'rtl'
         ? <KeyboardArrowLeftIcon />
         : <KeyboardArrowRightIcon />
        }
      </IconButton>
      <IconButton
        aria-label="last page"
        disabled={page === totalPages}
        onClick={(event) => onChangePage(event, totalPages)}
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </span>
  );
}


TablePaginationActions.propTypes = {
  count: PropTypes.number,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  updatePaging: PropTypes.func
};


export default TablePaginationActions;