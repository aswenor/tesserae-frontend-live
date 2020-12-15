/**
 * @fileoverview Styled header for the Tesserae search results table.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports ResultsTableBody
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:@material-ui/core
 */
import React from 'react';
import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';

import { makeStyles } from '@material-ui/core/styles'
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import { highlightMatches } from '../../utils';


/** CSS styles to apply to table cells. */
const useStyles = makeStyles(theme => ({
  root: {
    height: '80%',
    overflow: 'overlay'
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
  matchesCell: {
    overflowX: 'hidden',
    width: '10%'
  },
}));


/**
 * Sequence of cells with search results.
 * 
 * @component
 */
function ResultsTableBody(props) {
  const { idx, result } = props;

  /** CSS styles and global theme. */
  const classes = useStyles();

  // Get the indices of match words in each snippet.
  let sourceIndices = uniq(result.highlight.map(x => x[0])).sort();
  let targetIndices = uniq(result.highlight.map(x => x[1])).sort();

  const sourceSnippet = highlightMatches(result.source_snippet, result.source_tag, sourceIndices);
  const targetSnippet = highlightMatches(result.target_snippet, result.target_tag, targetIndices);

  return (
    <TableRow
      className={classes.row}
      hover
      tabIndex={-1}
      key={result.object_id}
    >
      <TableCell
        className={classes.numberCell}
        variant="body"
      >
        <Typography
          align="left"
        >
          {idx}
        </Typography>
      </TableCell>
      <TableCell
        align="left"
        className={classes.snippetCell}
        variant="body"
      >
        <Typography><b>{result.source_tag}</b>:</Typography>
          {sourceSnippet}
      </TableCell>
      <TableCell
        align="left"
        className={classes.snippetCell}
        size="small"
        style={{maxWidth: '10px'}}
        variant="body"
      >
        <Typography><b>{result.target_tag}</b>:</Typography>
          {targetSnippet}
      </TableCell>
      <TableCell
        align="center"
        className={classes.matchesCell}
        size="small"
        style={{maxWidth: '1px'}}
        variant="body"
      >
        <Typography>
          {result.matched_features.join(', ')}
          </Typography>
      </TableCell>
      <TableCell
        align="center"
        className={classes.numberCell}
        variant="body"
      >
        <Typography>
          <b>{Math.floor(result.score)}</b>
        </Typography>
      </TableCell>
    </TableRow>
  );
}


ResultsTableBody.propTypes = {
  /**
   * List of results as specified in the REST API.
   */
  results: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * Pairs of source/target snippet token indices corresponding to matches.
       */
      highlight: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),

      /**
       * Score of the match.
       */
      score: PropTypes.number,

      /**
       * Matching passage of source text.
       */
      source_snippet: PropTypes.string,

      /**
       * Locus of matching passage of source text.
       */
      source_tag: PropTypes.string,

      /**
       * Matching passage of target text.
       */
      target_snippet: PropTypes.string,

      /**
       * Locus of matching passage of source text.
       */
      target_tag: PropTypes.string,
    })
  ),

  /**
   * The index of the first entry on the page (0-indexed).
   */
  startIdx: PropTypes.number
};


export default ResultsTableBody;