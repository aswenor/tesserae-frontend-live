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
import { connect } from 'react-redux';

import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import CollapseBox from '../../common/CollapseBox';

import { updateSearchParametersAction } from '../../../api/corpus';


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
  const { stoplistBasis, updateSearchParameters } = props;

  const handleSelect = event => {
    updateSearchParameters({stoplistBasis: event.target.value});
  };

  const stoplistBases = availableStoplistBases.map(item => {
    const norm = item.toLowerCase();
    return (
      <MenuItem
        dense
        disableGutters
        key={norm}
        onClick={handleSelect}
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
          value={stoplistBasis}
          variant="filled"
        >
          {stoplistBases}
        </Select>
      </FormControl>
    </CollapseBox>
  );
}


StoplistBasisInput.propTypes = {
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
  return { stoplistBasis: state.searchParameters.stoplistBasis };
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
export default connect(mapStateToProps, mapDispatchToProps)(StoplistBasisInput);