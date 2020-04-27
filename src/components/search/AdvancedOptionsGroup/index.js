/**
 * @fileoverview Form for specifying advanced Tesserae search options.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports AdvancedOptionsGroup
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:redux
 * @requires NPM:react-redux
 * @requires NPM:@material-ui/core
 * @requires ../../common/LabeledSelect
 * @requires ../../../api/corpus
 */
import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';

import LabeledSelect from '../../common/LabeledSelect';

import { updateSearchParametersAction } from '../../../api/corpus';
import { updateSearchParameters } from '../../../state_management/search';


/**
 * Convert a string into the correct format for the dropdown.
 * 
 * @param {String} item The string to include in the dropdown.
 * @returns {Object} The object with 'label' and 'value' fields.
 * 
 * @example
 *   return prepListItem('foo');
 */
function prepListItem(item) {
  return {
    label: item,
    value: item
  };
}


// Dummy values for each option in the Tesserae search.
// To be used in production unless we migrate more metadata to the REST API.
const dummyUnitTypes = ['line', 'phrase'];
const dummyFeatures = ['form', 'lemmata', 'semantic', 'lemma + semantic', 'sound'];
const dummyStoplist = ['0', '10', '20', '30', '40', '50', '100', '150', '200'];
const dummyStoplistBasis = ['corpus', 'target', 'source', 'target + source'];
const dummyScoreBasis = ['stem', 'word'];
const dummyFrequencyBasis = ['corpus', 'texts'];
const dummyMaxDistance = ['None', '10 words', '20 words', '30 words', '40 words', '50 words'];
const dummyDistanceMetric = ['frequency', 'frequency-source', 'frequency-target', 'span', 'span-source', 'span-target'];
const dummyDropScoresBelow = ['No Cutoff', '3', '4', '5', '6', '7', '8', '9'];


/**
 * Form to specify advanced Tesserae search options.
 * 
 * @component
 * 
 * @example
 *  
 *  return (
 *    <AdvancedOptionsGroup
 *      distanceBasis="frequency"
 *      dropScoresBelow="5"
 *      feature="lemmata"
 *      frequencyBasis="corpus"
 *      maxDistance="10 words"
 *      scoreBasis="stem"
 *      stoplist="20"
 *      stoplistBasis="target"
 *      unitType="line"
 *    />
 *  );
 */
function AdvancedOptionsGroup(props) {
  const { distanceBasis, dropScoresBelow, feature, frequencyBasis,
          maxDistance, scoreBasis, stoplist, stoplistBasis, unitType } = props;

  /** Update the search parameters whenever a dropdown is changed. */
  const handleChange = label => event => {
    updateSearchParameters({ [label]: event.target.value });
  }

  const unitTypesList = dummyUnitTypes.map(prepListItem);
  const featuresList = dummyFeatures.map(prepListItem);
  const stoplistList = dummyStoplist.map(prepListItem);
  const stoplistBasisList = dummyStoplistBasis.map(prepListItem);
  const scoreBasisList = dummyScoreBasis.map(prepListItem);
  const frequencyBasisList = dummyFrequencyBasis.map(prepListItem);
  const maxDistanceList = dummyMaxDistance.map(prepListItem);
  const distanceBasisList = dummyDistanceMetric.map(prepListItem);
  const dropScoresBelowList = dummyDropScoresBelow.map(prepListItem);

  return (
    <div>
      <Grid
        container
        spacing={2}
        justify="space-evenly"
      >

        <Grid item xs={12}>
          <LabeledSelect
            handleChange={handleChange('unitType')}
            helperText={'Compare lines of text or complete thoughts.'}
            options={unitTypesList}
            value={unitType}
          />
        </Grid>

        <Grid item xs={12}>
          <LabeledSelect
            handleChange={handleChange('feature')}
            helperText={'Select the feature to compare on.'}
            options={featuresList}
            value={feature}
          />
        </Grid>

        <Grid item xs={12}>
          <LabeledSelect
            handleChange={handleChange('stoplist')}
            helperText={'Set the size of the stoplist'}
            options={stoplistList}
            value={stoplist}
          />
        </Grid>
        <Grid item xs={12}>
          <LabeledSelect
            handleChange={handleChange('stoplistBasis')}
            helperText={'Specify the source of stoplist frequencies.'}
            options={stoplistBasisList}
            value={stoplistBasis}
          />
        </Grid>

        <Grid item xs={12}>
          <LabeledSelect
            handleChange={handleChange('scoreBasis')}
            helperText={'Specify whether to measure scoring frequency by word or stem.'}
            options={scoreBasisList}
            value={scoreBasis}
          />
        </Grid>

        <Grid item xs={12}>
          <LabeledSelect
            handleChange={handleChange('frequencyBasis')}
            helperText={'Specify the source of scoring frequencies.'}
            options={frequencyBasisList}
            value={frequencyBasis}
          />
        </Grid>

        <Grid item xs={12}>
          <LabeledSelect
            handleChange={handleChange('maxDistance')}
            helperText={'Specify the maximum number of words between bigram tokens.'}
            options={maxDistanceList}
            value={maxDistance}
          />
        </Grid>

        <Grid item xs={12}>
          <LabeledSelect
            handleChange={handleChange('distanceMetric')}
            helperText={'Specify whether to base distance on porition or frequency.'}
            options={distanceBasisList}
            value={distanceBasis}
          />
        </Grid>

        <Grid item xs={12}>
          <LabeledSelect
            handleChange={handleChange('dropScoresBelow')}
            helperText={'Specify the minimum score to show.'}
            options={dropScoresBelowList}
            value={dropScoresBelow}
          />
        </Grid>
      </Grid>
    </div>
  );
}


AdvancedOptionsGroup.propTypes = {
  /**
   * Method by which to compute token distance, either "span" or "frequency".
   */
  distanceBasis: PropTypes.string,

  /**
   * Minimum similarity score to return.
   */
  dropScoresBelow: PropTypes.string,

  /**
   * Token feature to match on, e.g., "form", "lemma", etc. 
   */
  feature: PropTypes.string,

  /**
   * Source of scoring frequency data, e.g., "corpus", "source", "target", etc.
   */
  frequencyBasis: PropTypes.string,

  /**
   * Maximum allowable distance between match tokens to allow in results.
   */
  maxDistance: PropTypes.string,

  /**
   * ???
   */
  scoreBasis: PropTypes.string,

  /**
   * Size of the list of tokens to ignore.
   */
  stoplist: PropTypes.string,

  /**
   * Source of frequencies for creating the stoplist, either "corpus" or "texts".
   */
  stoplistBasis: PropTypes.string,

  /**
   * Chunk of text to search over, either "line" or "phrase".
   */
  unitType: PropTypes.string
}


/**
 * Add redux store state to this component's props.
 * 
 * @param {object} state The global state of the application.
 * @returns {object} Members of the global state to provide as props.
 */
function mapStateToProps(state) {
  const { unitType, feature, stoplist, stoplistBasis,
          scoreBasis, frequencyBasis, maxDistance,
          distanceBasis, dropScoresBelow } = state.searchParameters;
  return { unitType, feature, stoplist, stoplistBasis,
           scoreBasis, frequencyBasis, maxDistance,
           distanceBasis, dropScoresBelow };
}


/**
 * Add redux store actions to this component's props.
 * @param {funciton} dispatch The redux dispatch function.
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateSearchParameters: updateSearchParametersAction
  }, dispatch);
}


// Do redux binding here.
export default connect(mapStateToProps, mapDispatchToProps)(AdvancedOptionsGroup);
