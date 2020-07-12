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


/** CSS styles to apply to table cells. */
const useStyles = makeStyles(theme => ({
  root: {
    height: '80%',
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
 * Highlight relevant tokens in a result snippet.
 * 
 * @param {String} snippet The snippet to highlight.
 * @param {String} tag Locus identifier for the snippet.
 * @param {Array} matchIndices The indices of the tokens to highlight.
 * @returns {Array} A list of Typography components with matches highlighted.
 */
function highlightMatches(snippet, tag, matchIndices) {
  /** Array of highlighted tokens. */
  let highlightedSnippet = [];

  /** Split the snippet along whitespace. */
  let snippetTokens = snippet.split(/[\s.?!,;:/]+/);
  
  /** The current token index to inspect. */
  let current = 0;

  /** The next match token index. */
  let next = null;

  /** The current slice of the snippet to wrap. */
  let slice = null;

  // Iterate over the match indices, extract token slices, and highlight
  // relevant tokens.
  while (matchIndices.length > 0 || current < snippetTokens.length) {
    // Get the index of the next match token.
    next = matchIndices.shift();

    // If the current token is the next match token, highlight it.
    if (current === next) {
      slice = snippetTokens.slice(current, next + 1);
      highlightedSnippet.push(
        <Typography
            color="primary"
            component="span"
            key={`${tag} ${current},${next + 1}`}
          >
            {` ${slice.join(' ')}`}
          </Typography>
      );
      current = next + 1;
    }

    // If no more matches are found, slice into the remaining tokens and
    // wrap them without a highlight.
    else if (next === undefined) {
      slice = snippetTokens.slice(current, snippetTokens.length);

      highlightedSnippet.push(
        <Typography
          color="textPrimary"
          component="span"
          key={`${tag} ${current},${snippetTokens.length}`}
        >
          {` ${slice.join(' ')}`}
        </Typography>
      );
      
      current = snippetTokens.length;
    }

    // Otherwise, get the span of tokens leading up to the next match token
    // and wrap them without highlight, then get the match token and
    // highlight it.
    else {
      slice = snippetTokens.slice(current, next);
      highlightedSnippet.push(
        <Typography
          color="textPrimary"
          component="span"
          key={`${tag} ${current},${next}`}
        >
          {` ${slice.join(' ')}`}
        </Typography>
      );

      slice = snippetTokens.slice(next, next + 1);
      highlightedSnippet.push(
        <Typography
          color="primary"
          component="span"
          key={`${tag} ${next},${next + 1}`}
        >
          {` ${slice.join(' ')}`}
        </Typography>
      );

      current = next + 1;
    }
  }

  return highlightedSnippet;
}


/**
 * Sequence of cells with search results.
 * 
 * @component
 */
function ResultsTableBody(props) {
  const { results, startIdx } = props;

  /** CSS styles and global theme. */
  const classes = useStyles();

  /** Attempt to highlight the match tokens in each result snippet. */
  const bodyCells = results.map((item, idx) => {
    

    // Get the indices of match words in each snippet.
    let sourceIndices = uniq(item.highlight.map(x => x[0])).sort();
    let targetIndices = uniq(item.highlight.map(x => x[1])).sort();

    const sourceSnippet = highlightMatches(item.source_snippet, item.source_tag, sourceIndices);
    const targetSnippet = highlightMatches(item.target_snippet, item.target_tag, targetIndices);

    return (
      <TableRow
        className={classes.row}
        hover
        tabIndex={-1}
        key={item.object_id}
      >
        <TableCell
          className={classes.numberCell}
          variant="body"
        >
          <Typography
            align="left"
          >
            {idx + startIdx + 1}
          </Typography>
        </TableCell>
        <TableCell
          align="left"
          className={classes.snippetCell}
          variant="body"
        >
          <Typography><b>{item.source_tag}</b>:</Typography>
            {sourceSnippet}
        </TableCell>
        <TableCell
          align="left"
          className={classes.snippetCell}
          size="small"
          style={{maxWidth: '10px'}}
          variant="body"
        >
          <Typography><b>{item.target_tag}</b>:</Typography>
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
            {item.matched_features.join(', ')}
            </Typography>
        </TableCell>
        <TableCell
          align="center"
          className={classes.numberCell}
          variant="body"
        >
          <Typography>
            <b>{Math.floor(item.score)}</b>
          </Typography>
        </TableCell>
      </TableRow>
    );
  });

  return (
    <TableBody
      className={classes.root}
    >
      {bodyCells}
    </TableBody>
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