/**
 * @fileoverview Input widget for selecting the minimum score to return.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports DropScoresInput
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
import Slider from '@material-ui/core/Slider';

import CollapseBox from '../../common/CollapseBox';

import { clearSearchMetadata, updateSearchParameters } from '../../../state/search';


const sizes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


/**
 * Slider to select the minimum score resturned.
 * 
 * @component
 * 
 * @example
 *   const updateSearchParameters = update => update;
 *   return (
 *     <DropScoresInput
 *       updateSearchParameters={updateSearchParameters}
 *     />
 *   );
 */
function DropScoresInput(props) {
  const { clearSearchMetadata, updateSearchParameters } = props;

  const handleChange = (event, newMinScore) => {
    batch(() => {
      clearSearchMetadata();
      updateSearchParameters({dropScoresBelow: `${newMinScore}`});
    });
  };

  const marks = sizes.map(item => ({
    value: item,
    label: `${item}`
  }));

  return (
    <CollapseBox
      headerText="Drop Scores Below"
    >
      <FormControl
        fullWidth
        margin="dense"
      >
        <Slider
          aria-labelledby="discrete-slider-minscore"
          defaultValue={3}
          getAriaValueText={value => `${value}`}
          marks={marks}
          min={0}
          max={10}
          onChange={handleChange}
          step={1}
          valueLabelDisplay="auto"
        />
      </FormControl>
    </CollapseBox>
  );
}


DropScoresInput.propTypes = {
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
  return { };
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
export default connect(mapStateToProps, mapDispatchToProps)(DropScoresInput);