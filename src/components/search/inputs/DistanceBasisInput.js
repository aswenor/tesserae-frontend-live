/**
 * @fileoverview Input widget for selecting the distance basis of the search.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports DistanceBasisInput
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

import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import CollapseBox from '../../common/CollapseBox';

import { clearSearchMetadata, updateSearchParameters } from '../../../state/search';


const useStyles = makeStyles(theme => ({
  menu: {
    backgroundColor: '#ffffff'
  }
}));


/**
 * Available distance bases to search. Could also be loaded form the REST API.
 */
const availableDistanceBases = [
  'Frequency',
  'Frequency - Source',
  'Frequency - Target',
  'Span',
  'Span - Source',
  'Span - Target'
];


/**
 * Dropdown menu to select a search distance basis.
 * 
 * @component
 * 
 * @example
 *   const updateSearchParameters = update => update;
 *   return (
 *     <DistanceBasisInput
 *       distanceBasis="lemmata"
 *       updateSearchParameters={updateSearchParameters}
 *     />
 *   );
 */
function DistanceBasisInput(props) {
  const { clearSearchMetadata, distanceBasis,
          updateSearchParameters } = props;

  const classes = useStyles();

  const handleSelect = event => {
    batch(() => {
      clearSearchMetadata();
      updateSearchParameters({distanceBasis: event.target.value});
    });
  };

  const distanceBases = availableDistanceBases.map(item => {
    const norm = item.toLowerCase().replace(' ', '').replace(' ', '');
    return (
      <MenuItem
        dense
        disableGutters
        key={norm}
        selected={norm === distanceBasis}
        value={norm}
      >
        {item}
      </MenuItem>
    );
  });

  return (
    <CollapseBox
      headerText="Distance Basis"
    >
      <FormControl
        fullWidth
        margin="dense"
      >
        <Select
          className={classes.menu}
          onChange={handleSelect}
          value={distanceBasis}
          variant="outlined"
        >
          {distanceBases}
        </Select>
      </FormControl>
    </CollapseBox>
  );
}


DistanceBasisInput.propTypes = {
  /**
   * Distance basis currently selected.
   */
  distanceBasis: PropTypes.string,

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
  return { distanceBasis: state.search.searchParameters.distanceBasis };
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
export default connect(mapStateToProps, mapDispatchToProps)(DistanceBasisInput);