/**
 * @fileoverview Input widget for selecting the feature to search.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports FeatureInput
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
 * Available features to search. Could also be loaded form the REST API.
 */
const availableFeatures = [
  'Form',
  'Lemmata',
  'Semantic',
  'Lemma + Semantic',
  'Sound'
];


/**
 * Dropdown menu to select a search feature.
 * 
 * @component
 * 
 * @example
 *   const updateSearchParameters = update => update;
 *   return (
 *     <FeatureInput
 *       feature="lemmata"
 *       updateSearchParameters={updateSearchParameters}
 *     />
 *   );
 */
function FeatureInput(props) {
  const { clearSearchMetadata, feature, updateSearchParameters } = props;

  const classes = useStyles();

  const handleSelect = event => {
    batch(() => {
      clearSearchMetadata();
      updateSearchParameters({feature: event.target.value});
    });
  };

  const features = availableFeatures.map(item => {
    const norm = item.toLowerCase();
    return (
      <MenuItem
        dense
        disableGutters
        key={norm}
        selected={norm === feature}
        value={norm}
      >
        {item}
      </MenuItem>
    );
  });

  return (
    <CollapseBox
      headerText="Feature"
    >
      <FormControl
        fullWidth
        margin="dense"
      >
        <Select
          className={classes.menu}
          onChange={handleSelect}
          value={feature}
          variant="outlined"
        >
          {features}
        </Select>
      </FormControl>
    </CollapseBox>
  );
}


FeatureInput.propTypes = {
  /**
   * Feature currently selected.
   */
  feature: PropTypes.string,

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
  return { feature: state.search.searchParameters.feature };
}


/**
 * Add redux store actions to this component's props.
 * @param {function} dispatch The redux dispatch function.
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    clearSearchMetadata:  clearSearchMetadata,
    updateSearchParameters: updateSearchParameters
  }, dispatch);
}


// Do redux binding here.
export default connect(mapStateToProps, mapDispatchToProps)(FeatureInput);