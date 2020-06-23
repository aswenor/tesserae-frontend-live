/**
 * @fileoverview Search settings UI.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports SearchParametersForm
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:redux
 * @requires NPM:react-redux
 * @requires NPM:@material-ui/core
 * @requires NPM:@material-ui/icons
 * @requires ./AdvancedOptionsGroup
 * @requires ./TextSelectGroup
 * @requires ../../api/corpus
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';

import AdvancedOptionsGroup from './AdvancedOptionsGroup'
import TextSelectGroup from './TextSelectGroup';

import { fetchTexts } from '../../api/corpus';
import { fetchStoplist, initiateSearch } from '../../api/search';
import { clearResults, clearSearchMetadata, updateSourceText,
         updateTargetText } from '../../state/search';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    scrollbarColor: theme.palette.secondary.main,
    scrollbarWidth: 0,
    overflow: 'overlay',
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
  }
}));

/**
 * Custom styling to make ExpansionPanel layout more dense.
 * 
 * @component
 * 
 * @example
 *   return (
 *     <ExpansionPanel>
 *       <ExpansionPanelSummary>
 *         <p>Example summary text </p>
 *       </ExpansionPanelSummary>
 *       <ExpansionPanelDetails>
 *         <p>This is the interior text.</p>
 *       </ExpansionPanelDetails>
 *     </ExpansionPanel>
 *   );
 */
const ExpansionPanel = withStyles(theme => ({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    backgroundColor: theme.palette.secondary.main,
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
}))(MuiExpansionPanel);


/**
 * Custom styling to make ExpansionPanelSummary layout more dense.
 * 
 * @component
 * 
 * @example
 *   return (
 *     <ExpansionPanel>
 *       <ExpansionPanelSummary>
 *         <p>Example summary text </p>
 *       </ExpansionPanelSummary>
 *       <ExpansionPanelDetails>
 *         <p>This is the interior text.</p>
 *       </ExpansionPanelDetails>
 *     </ExpansionPanel>
 *   );
 */
const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);


/**
 * Custom styling to make ExpansionPanelSummary layout more dense.
 * 
 * @component
 * 
 * @example
 *   return (
 *     <ExpansionPanel>
 *       <ExpansionPanelSummary>
 *         <p>Example summary text </p>
 *       </ExpansionPanelSummary>
 *       <ExpansionPanelDetails>
 *         <p>This is the interior text.</p>
 *       </ExpansionPanelDetails>
 *     </ExpansionPanel>
 *   );
 */
const ExpansionPanelDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiExpansionPanelDetails);


/**
 * Form encapsulating all parameter options for a Tesserae search.
 * @component
 * 
 * @example
 *   return (
 *     <SearchParametersForm
 *       
 *     />
 *   );
 */
function SearchParametersForm(props) {
  const { asyncReady, availableTexts, clearResults, clearSearchMetadata,
          fetchStoplist, fetchTexts, initiateSearch, language, searchNeeded,
          searchParameters, sourceText, stopwords, targetText, updateSource,
          updateTarget } = props;

  const classes = useStyles();

  const clearAndInitiate = () => {
    if (searchNeeded) {
      clearResults();
      initiateSearch(sourceText, targetText, searchParameters,
                    stopwords, asyncReady);
    }
  };

  const handleTextChange = (text, updateFunc) => {
    console.log(text);
    clearSearchMetadata();
    updateFunc(text);
  }

  const shouldFetchTexts = asyncReady && availableTexts.length === 0;
  const disableSearch = stopwords.length === 0
                        || sourceText.object_id === undefined
                        || targetText.object_id === undefined;

  if (stopwords.length === 0) {
    const basis = searchParameters.stoplistBasis === 'corpus'
                  ? language
                  : [sourceText.object_id, targetText.object_id];
    fetchStoplist(searchParameters.feature, searchParameters.stoplist, basis, asyncReady);
  }

  // Most of the content here is the Material-UI Grid model to handle spacing
  // members of the form.
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
      <div
        className={classes.root}
      >
        <ExpansionPanel
          className={classes.panel}
          expanded={true}
          square
        >
          <ExpansionPanelDetails
          >
            <Grid container
              alignContent="center"
              alignItems="center"
              justify="flex-start"
              spacing={2}
            >
              <Grid item
                align="center"
                xs={12}
              >
                <TextSelectGroup
                  handleTextChange={(event, value) => handleTextChange(value, updateSource)}
                  loading={asyncReady}
                  loadingText={`Loading ${language} corpus`}
                  onOpen={() => {fetchTexts(language, shouldFetchTexts)}}
                  selection={sourceText}
                  textList={availableTexts}
                  title="Source Text"
                />
              </Grid>
              <Grid item 
                align="center"
                xs={12}
              >
                <TextSelectGroup
                  handleTextChange={(event, value) => handleTextChange(value, updateTarget)}
                  loading={asyncReady}
                  loadingText={`Loading ${language} corpus`}
                  onOpen={() => fetchTexts(language, shouldFetchTexts)}
                  selection={targetText}
                  textList={availableTexts}
                  title="Target Text"
                />
              </Grid>
              <Grid item
                align="center"
                xs={12}
              >
                <Fab
                  color="primary"
                  disabled={disableSearch}
                  onClick={clearAndInitiate}
                  variant="extended"
                >
                  <SearchIcon /> Search
                </Fab>
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel
          className={classes.panel}
          square
        >
          <ExpansionPanelSummary
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
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <AdvancedOptionsGroup />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    </Box>
  );
}


SearchParametersForm.propTypes = {
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
    availableTexts: state.corpus.availableTexts,
    language: state.corpus.language,
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
  clearResults: clearResults,
  clearSearchMetadata: clearSearchMetadata,
  fetchTexts: fetchTexts,
  fetchStoplist: fetchStoplist,
  initiateSearch: initiateSearch,
  updateSource: updateSourceText,
  updateTarget: updateTargetText
}, dispatch);


// Do redux binding here.
export default connect(mapStateToProps, mapDispatchToProps)(SearchParametersForm);
