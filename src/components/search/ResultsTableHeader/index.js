/**
 * @fileoverview Styled header for the Tesserae search results table.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports ResultsTableHeader
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:@material-ui/core
 */
import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';


/** CSS styles to apply to table cells. */
const cellStyles = makeStyles(theme => ({
  numberCell: {
    width: '1%'
  },
  snippetCell: {
    width: '48%'
  },
  matchesCell: {
    width: '10%'
  },
}));


/**
 * Header cells for the table with sorting buttons.
 * 
 * @component
 */
function ResultsTableHeader(props) {
  const { sortHeader, sortOrder, updateSortHeader, updateSortOrder } = props;

  /** Map sort direction from number to string. */
  const sortDirection = sortOrder === 1 ? 'asc' : 'desc';

  /** CSS styles and global theme. */
  const classes = cellStyles();

  /**
   * Update the column being sorted or the sorting order.
   * 
   * @param {String} header
   */
  const handleSortUpdate = header => {
    // Normalize the new header.
    const newSortHeader = header.toLowerCase();

    // If the header has not changed, change the order instead.
    // If a new header was selected, change to descending order.
    const newSortOrder = sortHeader === newSortHeader ? -sortOrder : -1;

    // Commit the changes.
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
          align="left"
          className={classes.snippetCell}
          key="source"
          onClick={() => handleSortUpdate('source_tag')}
          sortDirection={sortHeader === 'source_tag' ? sortDirection : false}
          variant="head"
        >
          <TableSortLabel
            active
            direction={sortDirection}
          >
            <Typography variant="h6"><b>Source</b></Typography>
          </TableSortLabel>
        </TableCell>
        <TableCell
          align="left"
          className={classes.snippetCell}
          key="target"
          onClick={() => handleSortUpdate('target_tag')}
          sortDirection={sortHeader === 'target_tag' ? sortDirection : false}
          variant="head"
        >
          <TableSortLabel
            active
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
            active
            direction={sortDirection}
          >
            <Typography variant="h6"><b>Score</b></Typography>
          </TableSortLabel>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}


ResultsTableHeader.propTypes = {
  /**
   * Header on which to search.
   */
  sortHeader: PropTypes.oneOf(['source_tag', 'target_tag', 'score']),

  /**
   * Order that cells are sorted (descending or ascending).
   */
  sortOrder: PropTypes.oneOf([-1, 1]),

  /**
   * Callback to sort by a new header.
   */
  updateSortHeader: PropTypes.func,

  /**
   * Callback to reverse the sort direction.
   */
  updateSortOrder: PropTypes.func
};


export default ResultsTableHeader;