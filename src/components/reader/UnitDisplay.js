/**
 * @fileoverview Text block displaying a single unit.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports UnitDisplay
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:@material-ui/core
 */
import React from 'react';
import PropTypes from 'prop-types';
import { isArray } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { highlightMatches } from '../../utils';


const useStyles = makeStyles(theme => ({
  root: {
    borderBottom: '1px solid #dedede',
    display: 'flex',
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
  }
}));


/**
 * Text block displaying a single unit.
 * 
 * @component
 * @example
 *  return (
 *    <UnitDisplay
 *      unit={{
 *        tags: '1.000',
 *        snippet: 'This is a chunk of example text.'
 *      }}
 *    />
 *  ); 
 */
function UnitDisplay(props) {
  const { highlight, snippet, tag } = props;
  console.log(props);

  const classes = useStyles();

  // If highlight token indices are provided, highlight the corresponding
  // tokens; otherwise, display the snippet as-is.
  const displaySnippet = (
    isArray(highlight) && highlight.length > 0
    ? highlightMatches(snippet, tag, highlight)
    : <Typography variant="body1">{snippet}</Typography>);

  return (
    <Grid container
      alignContent="center"
      alignItems="center"
      className={classes.root}
      justify="flex-start"
      key={tag}
      spacing={2}
    >
      <Grid item md={1} xs={12}>
        <Typography color="primary" align="center" variant="body1">
          {tag}
        </Typography>
      </Grid>
      <Divider orientation="vertical" />
      <Grid item md={10} xs={12}>
        {displaySnippet}
      </Grid>
    </Grid>
  );
}


UnitDisplay.propTypes = {
  /**
   * Word token indices to highlight.
   */
  highlight: PropTypes.arrayOf(PropTypes.number),

  /**
   * Text locus and metadata.
   */
  unit: PropTypes.shape({
    /**
     * The chunk of text to display.
     */
    snippet: PropTypes.string,

    /**
     * The locus tag (identifier) of this unit.
     */
    tag: PropTypes.string
  })
};


export default UnitDisplay;