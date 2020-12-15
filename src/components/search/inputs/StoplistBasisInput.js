/**
 * @fileoverview Input widget for selecting the stoplist basis of the search.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports StoplistBasisInput
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

import { clearSearchMetadata, clearStopwords,
         updateSearchParameters } from '../../../state/search';


const useStyles = makeStyles(theme => ({
  menu: {
    backgroundColor: '#ffffff'
  }
}));


/**
 * Available stoplist bases to search. Could also be loaded form the REST API.
 */
const availableStoplistBases = [
  'Corpus',
  'Target',
  'Source',
  'Target + Source'
];


/**
 * Dropdown menu to select a search stoplist basis.
 * 
 * @component
 * 
 * @example
 *   const updateSearchParameters = update => update;
 *   return (
 *     <StoplistBasisInput
 *       stoplistBasis="lemmata"
 *       updateSearchParameters={updateSearchParameters}
 *     />
 *   );
 */
function StoplistBasisInput(props) {
  const { clearSearchMetadata, clearStopwords, stoplistBasis,
          updateSearchParameters } = props;

  const classes = useStyles();

  const handleSelect = event => {
    batch(() => {
      clearStopwords();
      clearSearchMetadata();
      updateSearchParameters({stoplistBasis: event.target.value});
    });
  };

  const stoplistBases = availableStoplistBases.map(item => {
    const norm = item.toLowerCase();
    return (
      <MenuItem
        dense
        disableGutters
        key={norm}
        selected={norm === stoplistBasis}
        value={norm}
      >
        {item}
      </MenuItem>
    );
  });

  return (
    <CollapseBox
      headerText="Stoplist Basis"
    >
      <FormControl
        fullWidth
        margin="dense"
      >
        <Select
          className={classes.menu}
          onChange={handleSelect}
          value={stoplistBasis}
          variant="outlined"
        >
          {stoplistBases}
        </Select>
      </FormControl>
    </CollapseBox>
  );
}


StoplistBasisInput.propTypes = {
  /**
   * Function to clear the current stoplist.
   */
  clearStowords: PropTypes.func,

  /**
   * Stoplist basis currently selected.
   */
  stoplistBasis: PropTypes.string,

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
  return {
    stoplistBasis: state.search.searchParameters.stoplistBasis
  };
}


/**
 * Add redux store actions to this component's props.
 * @param {function} dispatch The redux dispatch function.
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    clearSearchMetadata: clearSearchMetadata,
    clearStopwords: clearStopwords,
    updateSearchParameters: updateSearchParameters,
  }, dispatch);
}


// Do redux binding here.
export default connect(mapStateToProps, mapDispatchToProps)(StoplistBasisInput);