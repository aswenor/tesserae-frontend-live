import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';


/** CSS styles to apply to table cells. */
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.secondary.main
  },
  row: {
    overflowX: 'hidden',
  },
  numberCell: {
    overflowX: 'hidden',
    width: '2%'
  },
  snippetCell: {
    overflowX: 'hidden',
    width: '43%'
  },
}));


function MultitextResultsSubtable(props) {
  const { multiresults } = props;

  const classes = useStyles();

  return (
    <Table
      aria-label="multitext-results"
      className={classes.root}
      size="small"
    >
      <TableHead>
        <TableRow
          className={classes.row}
        >
          <TableCell
            className={classes.numberCell}
          >
          </TableCell>
          <TableCell
            className={classes.numberCell}
          >
            <Typography><b>Locus</b></Typography>
          </TableCell>
          <TableCell
            className={classes.snippetCell}
          >
            <Typography><b>Snippet</b></Typography>
          </TableCell>
          <TableCell
            align="right"
            className={classes.numberCell}
          >
            <Typography><b>Score</b></Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        { multiresults.map((item, idx) => {
            return (
              <TableRow 
                className={classes.row}
                key={item.unit_id}
              >
                <TableCell
                  className={classes.numberCell}
                >
                  <Typography>
                    {idx + 1}
                  </Typography>
                </TableCell>
                <TableCell
                  className={classes.numberCell}
                >
                  <Typography>
                    {item.tag}
                  </Typography>
                </TableCell>
                <TableCell
                  className={classes.snippetCell}
                >
                  <Typography>
                    {item.snippet}
                  </Typography>
                </TableCell>
                <TableCell
                  align="right"
                  className={classes.numberCell}
                >
                  <Typography>
                    {Math.floor(item.score)}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })
        }
      </TableBody>
    </Table>
  );
}


MultitextResultsSubtable.propTypes = {
  /**
   * List of multitext results associated with this match.
   */
  multiresults: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * Score of this multitext result.
       */
      score: PropTypes.number,

      /**
       * Raw text of the matching locus.
       */
      snippet: PropTypes.string,

      /**
       * Locus identifier.
       */
      tag: PropTypes.string,

      /**
       * Database id of the unit (locus).
       */
      unit_id: PropTypes.string
    })
  ),
}


export default MultitextResultsSubtable;