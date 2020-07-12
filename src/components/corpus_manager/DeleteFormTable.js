import React from 'react';
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
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({}));


function DeleteFormTable(props) {
  const { onSelect, selected, texts, title } = props;

  const classes = useStyles(theme => ({
    root: {
      height: '100%'
    },
    body: {
      overflowY: 'scroll',
    }
  }));

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

  const bodyCells = texts.map(item => {
    const idx = findIndex(selected, x => x.object_id === item.object_id);
    return (
      <TableRow key={item.object_id}>
        <TableCell
          variant="body"
        >
          <Checkbox
            checked={idx >= 0}
            onChange={onSelect}
            value={item}
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