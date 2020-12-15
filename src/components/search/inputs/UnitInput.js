/**
 * @fileoverview Input widget for selecting the unit type.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports UnitInput
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

import FormControl from '@material-ui/core/FormControl';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import CollapseBox from '../../common/CollapseBox';

import { clearSearchMetadata, updateSearchParameters } from '../../../state/search';


/**
 * Dropdown menu to select the unit type.
 * 
 * @component
 * 
 * @example
 *   const updateSearchParameters = update => update;
 *   return (
 *     <UnitInput
 *       unit="phrase"
 *       updateSearchParameters={updateSearchParameters}
 *     />
 *   );
 */
function UnitInput(props) {
  const { clearSearchMetadata, unit, updateSearchParameters } = props;

  const handleChange = (event, newUnit) => {
    batch(() => {
      clearSearchMetadata();
      updateSearchParameters({unitType: newUnit});
    });
  };

  return (
    <CollapseBox
      headerText="Unit"
    >
      <FormControl
        margin="dense"
      >
        <ToggleButtonGroup
          aria-label="select unit type"
          exclusive
          onChange={handleChange}
          size="small"
          value={unit}
        >
          <ToggleButton
            aria-label="line unit type"
            selected={unit === 'line'}
            value="line"
          >
            Line
          </ToggleButton>
          <ToggleButton
            aria-label="phrase unit type"
            selected={unit === 'phrase'}
            value="phrase"
          >
            Phrase
          </ToggleButton>
        </ToggleButtonGroup>
      </FormControl>
    </CollapseBox>
  );
}


UnitInput.propTypes = {
  /**
   * Unit currently selected.
   */
  unit: PropTypes.string,

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
  return { unit: state.search.searchParameters.unitType };
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
export default connect(mapStateToProps, mapDispatchToProps)(UnitInput);