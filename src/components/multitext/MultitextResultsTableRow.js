import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { flatten, sortBy, uniq } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton'
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import MultitextResultsSubtable from './MultitextResultsSubtable';


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


function MultitextResultsTableRow(props) {
  const { highlight, idx, matched_features, multiresults, object_id, score,
          source_snippet, source_tag, target_snippet,
          target_tag } = props;

  const classes = useStyles();

  const [ open, setOpen ] = useState(idx > 1 ? false : true);

  // Get the indices of match words in each snippet.
  let sourceIndices = uniq(highlight.map(x => x[0])).sort();
  let targetIndices = uniq(highlight.map(x => x[1])).sort();

  const sourceSnippet = highlightMatches(source_snippet, source_tag, sourceIndices);
  const targetSnippet = highlightMatches(target_snippet, target_tag, targetIndices);

  const subtableEntries = sortBy(flatten(multiresults.map(item => item.units)), 'score').reverse();

  return (
    <React.Fragment
      key={object_id}
    >
      <TableRow>
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
          <Typography><b>{source_tag}</b>:</Typography>
            {sourceSnippet}
        </TableCell>
        <TableCell
          align="left"
          className={classes.snippetCell}
          size="small"
          style={{maxWidth: '10px'}}
          variant="body"
        >
          <Typography><b>{target_tag}</b>:</Typography>
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
            {matched_features.join(', ')}
            </Typography>
        </TableCell>
        <TableCell
          align="center"
          className={classes.numberCell}
          variant="body"
        >
          <Typography>
            <b>{Math.floor(score)}</b>
          </Typography>
        </TableCell>
        <TableCell
          align="center"
          className={classes.numberCell}
          variant="body"
        >
          { multiresults.length > 0
            ? <Typography>
                <IconButton 
                  aria-label="expand row"
                  onClick={() => setOpen(!open)}
                  size="small"
                >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
                More ({subtableEntries.length})
              </Typography>
            : <Typography>
                No multitext matches.
              </Typography>
          }
        </TableCell>
      </TableRow>
      { multiresults.length > 0 &&
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open}>
              <Box m={1}>
                <MultitextResultsSubtable multiresults={subtableEntries} />
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      }
    </React.Fragment>
  );
}


MultitextResultsTableRow.propTypes = {
  /**
   * Indices of match tokens to highlight in the source and target snippets.
   */
  highlight: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),

  /**
   * Index of the result in the table (one-indexed).
   */
  idx: PropTypes.number,

  /**
   * The features that this match was computed on.
   */
  matched_features: PropTypes.arrayOf(PropTypes.string),

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

  /**
   * Database id of this match.
   */
  object_id: PropTypes.string,

  /**
   * Score of the original search result.
   */
  score: PropTypes.number,

  /**
   * Raw text of the matching locus from the source text.
   */
  source_snippet: PropTypes.string,

  /**
   * Locus identifier of the source text match.
   */
  source_tag: PropTypes.string,

  /**
   * The starting index of the current page of results.
   */
  startIdx: PropTypes.number,

  /**
   * Raw text of the matching locus from the target text.
   */
  target_snippet: PropTypes.string,

  /**
   * Locus identifier of the target text match.
   */
  target_tag: PropTypes.string
};


export default MultitextResultsTableRow;