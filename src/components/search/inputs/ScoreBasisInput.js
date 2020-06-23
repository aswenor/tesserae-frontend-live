/**
 * @fileoverview Input widget for selecting the score basis.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports ScoreBasisInput
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:redux
 * @requires NPM:react-redux
 * @requires NPM:@material-ui/core
 */
import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import FormControl from '@material-ui/core/FormControl';

import CollapseBox from '../../common/CollapseBox';

import { clearSearchMetadata, updateSearchParameters } from '../../../state/search';


/**
 * Dropdown menu to select the score basis.
 * 
 * @component
 * 
 * @example
 *   const updateSearchParameters = update => update;
 *   return (
 *     <ScoreBasisInput
 *       scoreBasis="phrase"
 *       updateSearchParameters={updateSearchParameters}
 *     />
 *   );
 */
function ScoreBasisInput(props) {
  const { clearSearchMetadata, scoreBasis,
          updateSearchParameters } = props;

  const handleChange = (event, newScoreBasis) => {
    clearSearchMetadata();
    updateSearchParameters({scoreBasis: newScoreBasis});
  };

  return (
    <CollapseBox
      headerText="Score Basis"
    >
      <FormControl
        margin="dense"
      >
        <ToggleButtonGroup
          aria-label="select score basis"
          exclusive
          onChange={handleChange}
          size="small"
          value={scoreBasis}
        >
          <ToggleButton
            aria-label="word score basis"
            value="stem"
          >
            Stem
          </ToggleButton>
          <ToggleButton
            aria-label="word score basis"
            value="word"
          >
            Word
          </ToggleButton>
        </ToggleButtonGroup>
      </FormControl>
    </CollapseBox>
  );
}


ScoreBasisInput.propTypes = {
  /**
   * Score basis currently selected.
   */
  scoreBasis: PropTypes.string,

  /**
   * Callback to update the selected search parameters.
   */
  updateSearchParameters: PropTypes.func
}


/**
 * Add redux store state to this component's props.
 * 
 * @param {object} state The global state of the application.
 * @returns {object} Members of the global state to provide as props.
 */
function mapStateToProps(state) {
  return { scoreBasis: state.search.searchParameters.scoreBasis };
}


/**
 * Add redux store actions to this component's props.
 * @param {funciton} dispatch The redux dispatch function.
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    clearSearchMetadata: clearSearchMetadata,
    updateSearchParameters: updateSearchParameters
  }, dispatch);
}


// Do redux binding here.
export default connect(mapStateToProps, mapDispatchToProps)(ScoreBasisInput);