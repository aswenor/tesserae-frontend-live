import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles(theme => ({
  buttonStyles: {
    marginBottom: theme.spacing(2)
  }
}));


function SearchButtons(props) {
  const { multitextSelections, sourceText, targetText } = props;

  const classes = useStyles();

  const searchReady = sourceText.object_id && targetText.object_id;
  const multitextReady = searchReady && multitextSelections.length > 0;

  return (
    <Grid container
      alignContent="center"
      alignItems="center"
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
          Search
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
          Multitext
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


function mapStateToProps(state) {
  return {
    multitextSelections: state.multitext.selectedTexts,
    sourceText: state.search.sourceText,
    targetText: state.search.targetText
  }
}


export default connect(mapStateToProps)(SearchButtons);