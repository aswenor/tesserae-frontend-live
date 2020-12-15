/**
 * @fileoverview Input widget for selecting the frequency basis.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports FrequencyBasisInput
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
import { batch, connect } from 'react-redux';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import FormControl from '@material-ui/core/FormControl';

import CollapseBox from '../../common/CollapseBox';

import { clearSearchMetadata, updateSearchParameters } from '../../../state/search';


/**
 * Dropdown menu to select the frequency basis.
 * 
 * @component
 * 
 * @example
 *   const updateSearchParameters = update => update;
 *   return (
 *     <FrequencyBasisInput
 *       frequencyBasis="phrase"
 *       updateSearchParameters={updateSearchParameters}
 *     />
 *   );
 */
function FrequencyBasisInput(props) {
  const { clearSearchMetadata, frequencyBasis,
          updateSearchParameters } = props;

  const handleChange = (event, newFrequencyBasis) => {
    batch(() => {
      clearSearchMetadata();
      updateSearchParameters({frequencyBasis: newFrequencyBasis});
    });
  };

  return (
    <CollapseBox
      headerText="Frequency Basis"
    >
      <FormControl
        margin="dense"
      >
        <ToggleButtonGroup
          aria-label="select frequency basis"
          exclusive
          onChange={handleChange}
          size="small"
          value={frequencyBasis}
        >
          <ToggleButton
            aria-label="corpus frequency basis"
            value="corpus"
          >
            Corpus
          </ToggleButton>
          <ToggleButton
            aria-label="texts frequency basis"
            value="texts"
          >
            Texts
          </ToggleButton>
        </ToggleButtonGroup>
      </FormControl>
    </CollapseBox>
  );
}


FrequencyBasisInput.propTypes = {
  /**
   * FrequencyBasis currently selected.
   */
  frequencyBasis: PropTypes.string,

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
  return { frequencyBasis: state.search.searchParameters.frequencyBasis };
}


/**
 * Add redux store actions to this component's props.
 * @param {function} dispatch The redux dispatch function.
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    clearSearchMetadata: clearSearchMetadata,
    updateSearchParameters: updateSearchParameters
  }, dispatch);
}


// Do redux binding here.
export default connect(mapStateToProps, mapDispatchToProps)(FrequencyBasisInput);