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
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import range from 'lodash/range';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
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

  const [ expanded, setExpanded ] = useState(false);

  const totalPages = Math.ceil(count / rowsPerPage) - 1;
  const prevPage = Math.max(page - 1, 0);
  const nextPage = Math.min(page + 1, totalPages);

  // const pageNos = range(totalPages);

  // let pageButtons = [];
  // if (!expanded) {
  //   pageButtons.push();
  // }
  // else {
    
  // }

  return (
    <div
      className={classes.root}
    >
      <IconButton
        aria-label="first page"
        disabled={page === 0}
        onClick={() => onChangePage('currentPage', 0)}
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        aria-label="previous page"
        disabled={page === 0}
        onClick={() => onChangePage('currentPage', prevPage)}
      >
        {theme.direction === 'rtl'
         ? <KeyboardArrowRightIcon />
         : <KeyboardArrowLeftIcon />
        }
      </IconButton>
      <IconButton
        aria-label="next page"
        disabled={page === totalPages}
        onClick={() => onChangePage('currentPage', nextPage)}
      >
        {theme.direction === 'rtl'
         ? <KeyboardArrowLeftIcon />
         : <KeyboardArrowRightIcon />
        }
      </IconButton>
      <IconButton
        aria-label="last page"
        disabled={page === totalPages}
        onClick={() => onChangePage('currentPage', totalPages)}
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}


TablePaginationActions.propTypes = {
  count: PropTypes.number,
  currentPage: PropTypes.number,
  rowsPerPage: PropTypes.number,
  updatePaging: PropTypes.func
};


export default TablePaginationActions;