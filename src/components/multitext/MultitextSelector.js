/**
 * @fileoverview Interface for selecting additional texts in multitext search.
 * 
 * 
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { differenceBy, groupBy } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';

import AuthorGroup from './AuthorGroup';
import MultitextFilter from './MultitextFilter';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    display: 'flex',
    overflow: 'overlay',
  }
}));





function MultitextSelector(props) {
  const { availableTexts, filter, multitextSelections,
          sourceText, targetText } = props;

  const classes = useStyles();

  

  return (
    <div
      className={classes.root}
    >
      {displayTexts}
    </div>
  )
}


MultitextSelector.propTypes = {
  /**
   * List of available texts in the given language.
   */
  availableTexts: PropTypes.arrayOf(
    PropTypes.shape({
      object_id: PropTypes.string,
      author: PropTypes.string,
      title: PropTypes.string
    })
  ),

  /**
   * Selected texts for multitext search.
   */
  multitextSelections: PropTypes.arrayOf(
    PropTypes.shape({
      object_id: PropTypes.string,
      author: PropTypes.string,
      title: PropTypes.string
    })
  ),

  /**
   * Selected source text.
   */
  sourceText: PropTypes.shape({
    object_id: PropTypes.string,
    author: PropTypes.string,
    title: PropTypes.string
  }),

  /**
   * Selected target text.
   */
  targetText: PropTypes.shape({
    object_id: PropTypes.string,
    author: PropTypes.string,
    title: PropTypes.string
  })
}


/**
 * Add redux store state to this component's props.
 * 
 * @param {object} state The global state of the application.
 * @returns {object} Members of the global state to provide as props.
 */
function mapStateToProps(state) {
  return {
    availableTexts: state.corpus.availableTexts,
    selectedTexts: state.multitext.selectedTexts,
    sourceText: state.search.sourceText,
    targetText: state.search.targetText
  }
}


/**
 * Add redux store actions to this component's props.
 * 
 * @param {function} dispatch The redux dispatch function.
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}


// Do redux binding here.
export default connect(mapStateToProps, mapDispatchToProps)(MultitextSelector);