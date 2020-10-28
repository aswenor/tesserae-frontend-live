/**
 * @fileoverview Buttons to jump to search or multitext search.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports SearchButtons
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:react-redux
 * @requires NPM:react-router-dom
 * @requires NPM:@material-ui/core
 * @requires NPM:@material-ui/icons
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';

import SearchIcon from '@material-ui/icons/Search';


/** CSS styles to apply to the component. */
const useStyles = makeStyles(theme => ({
  buttonStyles: {
    marginBottom: theme.spacing(2)
  }
}));


/**
 * Buttons to jump to search or multitext search.
 * 
 * @component 
 * @example
 *  return (
 *    <SearchButtons
 *      multitextSelections={[]}
 *      sourceText={{
 *        author: 'vergil',
 *        is_prose: false,
 *        object_id: '89237645fa965',
 *        title: 'aeneid',
 *        year: -25
 *      }}
 *      targetText={{
 *        author: 'lucan',
 *        is_prose: false,
 *        object_id: 'd76815d1fae4e',
 *        title: 'bellum civile',
 *        year: 65
 *      }}
 *    />
 *  );
 */
function SearchButtons(props) {
  const { multitextSelections, sourceText, targetText } = props;

  /** CSS styles and global theme. */
  const classes = useStyles();

  /** Flags indicating if each button should be active */
  const searchReady = sourceText.object_id && targetText.object_id;
  const multitextReady = searchReady && multitextSelections.length > 0;

  return (
    <Grid container
      alignContent="center"
      alignItems="center"
      direction="column"
      justify="center"
    >
      <Grid item xs={12}
        className={classes.buttonStyles}
      >
        <Fab
          color="primary"
          component={Link}
          disabled={!searchReady}
          to={'/'}
          variant="extended"
        >
          <SearchIcon />Search
        </Fab>
      </Grid>
      <Grid item xs={12}
        className={classes.buttonStyles}
      >
        <Fab
          color="primary"
          component={Link}
          disabled={!multitextReady}
          to={'/multitext'}
          variant="extended"
        >
          <SearchIcon />Multitext
        </Fab>
      </Grid>
    </Grid>
  );
}


SearchButtons.propTypes = {
  /**
   * Additional texts to run multitext search over.
   */
  multitextSelections: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * Database id of the text.
       */
      object_id: PropTypes.string
    })
  ),

  /**
   * Source text of the search.
   */
  sourceText: PropTypes.shape({
    /**
     * Database id of the text.
     */
    object_id: PropTypes.string
  }),

  /**
   * Target text of the search.
   */
  targetText: PropTypes.shape({
    /**
     * Database id of the text.
     */
    object_id: PropTypes.string
  })
};


/**
 * Add redux store state to this component's props.
 * 
 * @param {object} state The global state of the application.
 * @returns {object} Members of the global state to provide as props.
 */
function mapStateToProps(state) {
  return {
    multitextSelections: state.multitext.selectedTexts,
    sourceText: state.search.sourceText,
    targetText: state.search.targetText
  }
}


// Do redux binding here.
export default connect(mapStateToProps)(SearchButtons);