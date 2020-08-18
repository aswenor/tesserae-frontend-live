import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';

import { fetchTexts } from '../../api/corpus';
import { clearSearchMetadata, updateSourceText, updateTargetText } from '../../state/search';

import TextSelectDropdowns from './TextSelectDropdowns';


/**
 * Set of dropdowns for selecting source and target texts.
 * @component 
 */
function TextSelectGroup(props) {
  const { asyncReady, availableTexts, language, sourceText, targetText,
          updateSource, updateTarget } = props

  const handleTextChange = (text, updateFunc) => {
    console.log(text);
    clearSearchMetadata();
    updateFunc(text);
  }

  const shouldFetchTexts = asyncReady && availableTexts.length === 0;

  return (
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
        <TextSelectDropdowns
          handleTextChange={(event, value) => handleTextChange(value, updateSource)}
          loading={availableTexts.length === 0}
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
        <TextSelectDropdowns
          handleTextChange={(event, value) => handleTextChange(value, updateTarget)}
          loading={availableTexts.length === 0}
          loadingText={`Loading ${language} corpus`}
          onOpen={() => fetchTexts(language, shouldFetchTexts)}
          selection={targetText}
          textList={availableTexts}
          title="Target Text"
        />
      </Grid>
    </Grid>
  );
}


TextSelectGroup.propTypes = {
  /**
   * Flag determining if an AJAX call may be initiated.
   */
  asyncReady: PropTypes.bool,

  /**
   * List of texts exposed by the REST API.
   */
  availableTexts: PropTypes.arrayOf(PropTypes.object),

  /**
   * Function to clear out search ID and status.
   */
  clearSearchMetadata: PropTypes.func,
  
  /**
   * Function to retrieve texts from the REST API.
   */
  fetchTexts: PropTypes.func,

  /**
   * The current language populating the UI.
   */
  language: PropTypes.string,

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
    searchParameters: state.search.searchParameters,
    sourceText: state.search.sourceText,
    targetText: state.search.targetText,
  };
};


/**
 * Add redux store actions to this component's props.
 * @param {function} dispatch The redux dispatch function.
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  fetchTexts: fetchTexts,
  updateSource: updateSourceText,
  updateTarget: updateTargetText
}, dispatch);


// Do redux binding here.
export default connect(mapStateToProps, mapDispatchToProps)(TextSelectGroup);