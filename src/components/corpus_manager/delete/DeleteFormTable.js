import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { findIndex } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import TablePaginationActions from '../../common/TablePaginationActions';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    height: '100%'
  },
  body: {
    overflowY: 'scroll',
  }
}));


function DeleteFormTable(props) {
  const { onSelect, selected, texts, title } = props;

  const classes = useStyles();

  const [ paging, setPaging] = useState({
    currentPage: 0,
    rowsPerPage: 10,
    sortHeader: 'author',
    sortOrder: 1
  });

  const handlePagingUpdate = (label, value) => {
    // Create a new paging object by copying the old and overwriting
    // the updated field.
    let newPaging = {...paging, [label]: value};
    
    // If the sort header was submitted but has not changed, change
    // the sort direction.
    if (label === 'sortHeader' && value === paging.sortHeader) {
      newPaging.sortOrder = -paging.sortOrder;
    }

    // If anything other than the current page was changed,
    // go to the new first page.
    if (label !== 'currentPage') {
      newPaging.currentPage = 0;
    }

    setPaging(newPaging);
  };

  const headerCells = ['', 'Author', 'Title'].map(item => {
    return (
      <TableCell 
        key={item}
        variant="head"
      >
        <Typography variant="h6"><b>{item}</b></Typography>
      </TableCell>
    );
  });

  const start = paging.currentPage * paging.rowsPerPage;
  const end = start + paging.rowsPerPage;

  const bodyCells = texts
    .slice(start, end)
    .map(item => {
      const checked = findIndex(selected, x => x.object_id === item.object_id) >= 0;
      return (
        <TableRow key={item.object_id}>
          <TableCell
            variant="body"
          >
            <Checkbox
              checked={checked}
              color="primary"
              onChange={(event) => onSelect(event.target.checked, item)}
              value={item.object_id}
            />
          </TableCell>
          <TableCell
            variant="body"
          >
            {item.author}
          </TableCell>
          <TableCell
            variant="body"
          >
            {item.title}
          </TableCell>
        </TableRow>
      );
    });

  return (
    <Paper>
      <Toolbar>
        <Typography variant="h4">
          {title}
        </Typography>
      </Toolbar>
      <TableContainer>
        <Table
          stickyHeader
        >
          <TableHead>
            <TableRow>
              {headerCells}
            </TableRow>
          </TableHead>
          <TableBody>
            {bodyCells}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        ActionsComponent={TablePaginationActions}
        count={texts.length}
        onChangePage={handlePagingUpdate}
        onChangeRowsPerPage={(event) => handlePagingUpdate('rowsPerPage', event.target.value)}
        page={paging.currentPage}
        rowsPerPage={paging.rowsPerPage}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Paper>
  );
}


DeleteFormTable.propTypes = {
  onSelect: PropTypes.func,
  selected: PropTypes.arrayOf(
    PropTypes.shape({
      object_id: PropTypes.string
    })
  ),
  texts: PropTypes.arrayOf(
    PropTypes.shape({
      author: PropTypes.string,
      object_id: PropTypes.string,
      title: PropTypes.string
    })
  ),
  title: PropTypes.string
}


export default DeleteFormTable;