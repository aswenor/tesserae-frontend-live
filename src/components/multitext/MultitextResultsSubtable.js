import React from 'react';
import PropTypes from 'prop-types';
import { flatten } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';


/** CSS styles to apply to table cells. */
const useStyles = makeStyles(theme => ({
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
  
  const entries = flatten(multiresults.map(item => item.units));

  if (multiresults.length > 0) {
    console.log('multitext peek');
    console.log(multiresults);
    console.log(multiresults.map(x => x.units));
    console.log(entries);
  }


  return (
    <Table
      aria-label="multitext-results"
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
            <Typography>Locus</Typography>
          </TableCell>
          <TableCell
            className={classes.snippetCell}
          >
            <Typography>Snippet</Typography>
          </TableCell>
          <TableCell
            align="right"
            className={classes.numberCell}
          >
            <Typography>Score</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        { entries.map((item, idx) => {
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