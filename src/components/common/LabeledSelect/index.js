/**
 * @fileoverview Dropdown menu with associated content label for quick reuse.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports LabeledSelect
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:@material-ui/core
 */
import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


/** CSS styles to apply to the component. */
const useStyles = makeStyles(theme => ({
  select: {
    marginTop: 10,
    marginLeft: '5%',
    width: '90%'
  }
}));

/**
 * Dropdown select menu with associated help label.
 * 
 * @component
 * 
 * @example
 *   const handleChange = (event) => event;
 *   const options = [{label: 'One', value: '1'}, {label: 'Two', value: '2'}];
 *   return (
 *     <LabeledSelect
 *       handleChange={handleChange}
 *       helperText="Example dropdown"
 *       options={options}
 *       value="2"
 *     />
 *   );
 */
function LabeledSelect(props) {
  const { handleChange, helperText, options, value } = props;

  /** CSS styles and global theme. */
  const classes = useStyles();

  /** Array of options components. */
  const menuItems = options.map((x, i) => {
    return (<MenuItem value={x.value} key={x.value}>{x.label}</MenuItem>);
  });

  return (
    <FormControl fullWidth>
      <Select
        className={classes.select}
        onChange={handleChange}
        value={value}
        variant="outlined"
      >
        {menuItems}
      </Select>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}


LabeledSelect.propTypes = {
  /**
   * Menu item selection callback.
   */
  handleChange: PropTypes.func,

  /**
   * Description of the options in this dropdown.
   */
  helperText: PropTypes.string,

  /**
   * Options that may be selected.
   */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * Display value of the menu item.
       */
      label: PropTypes.string,

      /**
       * Actual value of the menu item.
       */
      value: PropTypes.string
  })),

  /**
   * Current value of the dropdown.
   */
  value: PropTypes.string
}


export default LabeledSelect;
