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
 * @requires ../AdvancedOptionsGroup
 * @requires ../TextSelectGroup
 * @requires ../../../api/corpus
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import AdvancedOptionsGroup from '../AdvancedOptionsGroup'
import TextSelectGroup from '../TextSelectGroup';

import { fetchStoplistAction, fetchTextsAction,
         updateSourceTextAction, updateTargetTextAction } from '../../../api/corpus';


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
const ExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    width: '100%',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiExpansionPanel);


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
  const { availableTexts, disableSearch, fetchTexts, fetchStoplist, language,
          pending, searchParameters, shouldFetchTexts, sourceText, targetText,
          updateSource, updateTarget } = props;

  /** The actual basis used by the REST API uses language names or text IDs, so this converts. */
  const basis = (searchParameters !== undefined && searchParameters.stoplistBasis === 'corpus'
                 ? language
                 : [sourceText.object_id, targetText.object_id]);

  // Most of the content here is the Material-UI Grid model to handle spacing
  // members of the form.
  return (
    <Box
      component="section"
      display="flex"
      flexDirection="column"
      flexGrow={1}
      width={1}
    >
      <ExpansionPanel
        expanded={true}
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
                handleTextChange={updateSource}
                loading={pending}
                loadingText={
                  <Typography variant="h6">
                    <CircularProgress />{`Loading ${language} corpus`}
                  </Typography>
                }
                onOpen={() => fetchTexts(language, shouldFetchTexts)}
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
                handleTextChange={updateTarget}
                loading={pending}
                loadingText={
                  <Typography variant="p">
                    <CircularProgress />{`Loading ${language} corpus`}
                  </Typography>
                }
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
              <Button
                color="primary"
                disabled={disableSearch}
                onClick={() => fetchStoplist(searchParameters.feature, parseInt(searchParameters.stoplist, 10), basis, pending)}
                variant="contained"
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
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
    </Box>
  );
}


SearchParametersForm.propTypes = {
  /**
   * List of texts exposed by the REST API.
   */
  availableTexts: PropTypes.arrayOf(PropTypes.object),
  
  /**
   * Flag to disable the search button if parameters are missing.
   */
  disableSearch: PropTypes.bool,
  
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
   * Flag indicating that an AJAX call is in progress.
   */
  pending: PropTypes.bool,
  
  /**
   * Object containing all currently selected advanced parameters for the search.
   */
  searchParameters: PropTypes.object,
  
  /**
   * Flag indicating that texts should be retrieved from the REST API.
   */
  shouldFetchTexts: PropTypes.bool,
  
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
    availableTexts: state.availableTexts,
    disableSearch: state.disableSearch,
    language: state.language,
    pending: state.asyncPending,
    searchParameters: state.searchParameters,
    shouldFetchStoplist: state.shouldFetchStoplist,
    shouldFetchTexts: state.shouldFetchTexts,
    sourceText: state.sourceText,
    stopwords: state.stopwords,
    targetText: state.targetText,
  };
};


/**
 * Add redux store actions to this component's props.
 * @param {funciton} dispatch The redux dispatch function.
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  fetchTexts: fetchTextsAction,
  fetchStoplist: fetchStoplistAction,
  updateSource: updateSourceTextAction,
  updateTarget: updateTargetTextAction
}, dispatch);


// Do redux binding here.
export default connect(mapStateToProps, mapDispatchToProps)(SearchParametersForm);
