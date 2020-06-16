/**
 * @fileoverview Input widget for selecting the stoplist size.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports StoplistInput
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

import Slider from '@material-ui/core/Slider';
import FormControl from '@material-ui/core/FormControl';

import CollapseBox from '../../common/CollapseBox';

import { updateSearchParameters } from '../../../state/search';


const sizes = [0, 50, 100, 150, 200];


/**
 * Slider to select the stoplist size.
 * 
 * @component
 * 
 * @example
 *   const updateSearchParameters = update => update;
 *   return (
 *     <StoplistInput
 *       stoplist="phrase"
 *       updateSearchParameters={updateSearchParameters}
 *     />
 *   );
 */
function StoplistInput(props) {
  const handleChange = (event, newStoplist) => {
    updateSearchParameters({stoplist: `${newStoplist}`});
  };

  const marks = sizes.map(item => ({
    value: item,
    label: `${item}`
  }));

  return (
    <CollapseBox
      headerText="Stoplist Size"
    >
      <FormControl
        fullWidth
        margin="dense"
      >
        <Slider
          aria-labelledby="discrete-slider-stoplist"
          defaultValue={10}
          getAriaValueText={value => `${value} words`}
          marks={marks}
          min={0}
          max={200}
          onChange={handleChange}
          step={1}
          valueLabelDisplay="auto"
        />
      </FormControl>
    </CollapseBox>
  );
}


StoplistInput.propTypes = {
  /**
   * Stoplist currently selected.
   */
  stoplist: PropTypes.string,

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
  return {  };
}


/**
 * Add redux store actions to this component's props.
 * @param {funciton} dispatch The redux dispatch function.
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateSearchParameters: updateSearchParameters
  }, dispatch);
}


// Do redux binding here.
export default connect(mapStateToProps, mapDispatchToProps)(StoplistInput);