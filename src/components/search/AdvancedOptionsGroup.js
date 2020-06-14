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

import Box from '@material-ui/core/Box';

import DistanceBasisInput from './inputs/DistanceBasisInput';
import DropScoresInput from './inputs/DropScoresInput';
import FeatureInput from './inputs/FeatureInput';
import FrequencyBasisInput from './inputs/FrequencyBasisInput';
import ScoreBasisInput from './inputs/ScoreBasisInput';
import StoplistBasisInput from './inputs/StoplistBasisInput';
import StoplistInput from './inputs/StoplistInput';
import UnitInput from './inputs/UnitInput';


/**
 * Form to specify advanced Tesserae search options.
 * 
 * @component
 * 
 * @example
 *  
 *  return (
 *    <AdvancedOptionsGroup />
 *  );
 */
function AdvancedOptionsGroup(props) {
  return (
    <Box>
        <UnitInput />
        <FeatureInput />
        <StoplistInput />
        <StoplistBasisInput />
        <FrequencyBasisInput />
        <ScoreBasisInput />
        <DistanceBasisInput />
        <DropScoresInput />
    </Box>
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


// Do redux binding here.
export default AdvancedOptionsGroup;
