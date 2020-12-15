import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { batch, connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';

import AdvancedOptionsGroup from '../search/AdvancedOptionsGroup';
import LanguageSelectMenu from '../common/LanguageSelectMenu';
import { updateSearchInProgress, updateMultitextInProgress } from '../../state/async';
import { clearResults as clearMultitextResults } from '../../state/multitext';
import { clearResults, clearSearchMetadata } from '../../state/search';
import { fetchStoplist, initiateSearch } from '../../api/search';
import { MarginlessExpansionPanel, MarginlessExpansionPanelDetails, 
         MarginlessExpansionPanelSummary } from '../common/MarginlessExpansionPanel';
import SelectedMultitextList from './SelectedMultitextList';
import TextSelectGroup from '../search/TextSelectGroup';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    scrollbarColor: theme.palette.secondary.main,
    scrollbarWidth: 0,
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      backgroundColor: theme.palette.secondary.main,
      width: '0em',
      display: 'none'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      display: 'none',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      display: 'none',
      outline: '1px solid slategrey'
    }
  },
  panel: {
    backgroundColor: theme.palette.secondary.main
  },
  mtContainer: {
    marginTop: theme.spacing(1)
  }
}));


function MultitextParametersLeft(props) {
  const { asyncReady, clearMultitextResults, clearResults, fetchStoplist, initiateSearch,
          language, multitextSelections, searchNeeded, searchParameters, sourceText,
          stopwords, targetText, toggleSideBar, updateMultitextInProgress,
          updateSearchInProgress } = props;

  const classes = useStyles();

  const disableSearch = stopwords.length === 0
                        || sourceText.object_id === undefined
                        || targetText.object_id === undefined
                        || multitextSelections.length === 0;

  if (language !== '' && stopwords.length === 0) {
    const basis = searchParameters.stoplistBasis === 'corpus'
                  ? language
                  : [sourceText.object_id, targetText.object_id];
    fetchStoplist(searchParameters.feature, searchParameters.stoplist, basis, asyncReady);
  }

  const clearAndInitiate = () => {
    if (searchNeeded) {
      batch(() => {
        clearResults();
        clearMultitextResults();
        updateMultitextInProgress(true);
      });
      initiateSearch(sourceText, targetText, searchParameters,
                     stopwords, asyncReady);
    }
  };

  return (
    <Box
      className={classes.root}
      component="section"
      display="flex"
      flexDirection="column"
      flexGrow={1}
      height={'100%'}
      width={1}
    >
      <div className={classes.root}>
        <MarginlessExpansionPanel
          className={classes.panel}
          expanded={true}
          square
        >
          <MarginlessExpansionPanelDetails>
            <Grid container
              alignContent="center"
              alignItems="center"
              justify="flex-start"
              spacing={2}
            >
              <Grid item xs={12}>
                <LanguageSelectMenu
                  toggleSideBar={toggleSideBar}
                />
              </Grid>
              <Grid item xs={12}>
                <TextSelectGroup />
              </Grid>
              <Grid item xs={12}
                align="center"
              >
                <Fab
                  disabled={disableSearch}
                  onClick={clearAndInitiate}
                  variant="extended"
                >
                  <SearchIcon />Search
                </Fab>
              </Grid>
              <Grid item xs={12}
                className={classes.mtContainer}
              >
                <SelectedMultitextList />
              </Grid>
            </Grid>
          </MarginlessExpansionPanelDetails>
        </MarginlessExpansionPanel>
        <MarginlessExpansionPanel
          className={classes.panel}
          square
        >
          <MarginlessExpansionPanelSummary
            aria-controls="advanced-options-form"
            expandIcon={<ExpandMoreIcon />}
            id="advanced-options-header"
          >
            <Typography
              align="center"
              variant="h5"
            >
              Advanced Options
            </Typography>
          </MarginlessExpansionPanelSummary>
          <MarginlessExpansionPanelDetails>
            <AdvancedOptionsGroup />
          </MarginlessExpansionPanelDetails>
        </MarginlessExpansionPanel>
      </div>
    </Box>
  );
}


MultitextParametersLeft.propTypes = {
  /**
   * Flag determining if an AJAX call may be initiated.
   */
  asyncReady: PropTypes.bool,

  /**
   * List of texts exposed by the REST API.
   */
  availableTexts: PropTypes.arrayOf(PropTypes.object),

  /**
   * Function to clear out an existing search.
   */
  clearResults: PropTypes.func,

  /**
   * Function to clear out search ID and status.
   */
  clearSearchMetadata: PropTypes.func,
  
  /**
   * Function to retrieve texts from the REST API.
   */
  fetchTexts: PropTypes.func,
  
  /**
   * Function to retrieve the specified stoplist from the REST API.
   */
  fetchStoplist: PropTypes.func,
  
  /**
   * The current language populating the UI.
   */
  language: PropTypes.string,
  
  /**
   * Object containing all currently selected advanced parameters for the search.
   */
  searchParameters: PropTypes.object,

  /**
   * The currently selected source text.
   */
  sourceText: PropTypes.object,
  
  /**
   * The currently selected target text.
   */
  targetText: PropTypes.object,

  /**
   * Function to select a new source text from the dropdown menu.
   */
  updateSource: PropTypes.func,
  
  /**
   * Function to select a new target text from the dropdown menu.
   */
  updateTarget: PropTypes.func
};


/**
 * Add redux store state to this component's props.
 * 
 * @param {object} state The global state of the application.
 * @returns {object} Members of the global state to provide as props.
 */
const mapStateToProps = (state) => {
  return {
    asyncReady: state.async.asyncPending < state.async.maxAsyncPending,
    language: state.corpus.language,
    multitextSelections: state.multitext.selectedTexts,
    searchNeeded: state.search.searchID === '',
    searchParameters: state.search.searchParameters,
    sourceText: state.search.sourceText,
    stopwords: state.search.stopwords,
    targetText: state.search.targetText,
  };
};


/**
 * Add redux store actions to this component's props.
 * @param {function} dispatch The redux dispatch function.
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  clearMultitextResults: clearMultitextResults,
  clearResults: clearResults,
  clearSearchMetadata: clearSearchMetadata,
  fetchStoplist: fetchStoplist,
  initiateSearch: initiateSearch,
  updateMultitextInProgress: updateMultitextInProgress,
  updateSearchInProgress: updateSearchInProgress
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(MultitextParametersLeft);