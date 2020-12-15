import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox'
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';

import { addTexts, clearTexts } from '../../state/multitext';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.secondary.main
  }
}));


function MultitextSelectionTableHeader(props) {
  const { addTexts, clearTexts, setPagination, sortHeader, sortOrder,
          textList } = props;

  const classes = useStyles()

  const [ checked, setChecked ] = useState(false);

  const order = sortOrder === 1 ? 'asc' : 'desc';

  const handleSelect = event => {
    const wasChecked = event.target.checked;

    setChecked(wasChecked);

    if (wasChecked) {
      addTexts(textList);
    }
    else {
      clearTexts();
    }
  };

  const handleHeaderClick = newHeader => {
    if (newHeader === sortHeader) {
      setPagination(prev => ({...prev, currentPage: 0, sortOrder: -sortOrder}));
    }
    else {
      setPagination(prev => (
        {...prev, currentPage: 0, sortHeader: newHeader, sortOrder: -1}));
    }
  };

  return (
    <TableRow
      className={classes.roots}
    >
      <TableCell variant="head">
        <Checkbox
          checked={checked}
          onChange={handleSelect}
        />
      </TableCell>
      <TableCell
        variant="head"
        sortDirection={sortHeader === "author" ? order : false}
      >
        <TableSortLabel
          active={sortHeader === "author"}
          direction={sortHeader === "author"
                      ? (sortOrder === 1 ? 'asc' : 'desc')
                      : 'asc'
          }
          onClick={() => handleHeaderClick("author")}
        >  
          <Typography><b>Author</b></Typography>
        </TableSortLabel>
      </TableCell>
      <TableCell
        variant="head"
        sortDirection={sortHeader === "title" ? order : false}
      >
        <TableSortLabel
          active={sortHeader === "title"}
          direction={sortHeader === "title"
                      ? (sortOrder === 1 ? 'asc' : 'desc')
                      : 'asc'
          }
          onClick={() => handleHeaderClick("title")}
        >  
          <Typography><b>Title</b></Typography>
        </TableSortLabel>
      </TableCell>
    </TableRow>
  );
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addTexts: addTexts,
    clearTexts: clearTexts
  }, dispatch)
}


export default connect(null, mapDispatchToProps)(MultitextSelectionTableHeader);