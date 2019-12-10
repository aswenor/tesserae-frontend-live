import React from 'react';
import PropTypes from 'prop-types';
import { makeStyle } from '@material-ui/core/styles';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


// const styles = theme => ({
//   select: {
//     marginTop: 10,
//     marginLeft: '5%',
//     width: '90%'
//   }
// });


function LabeledSelect(props) {
  const menuItems = props.options.map((x, i) => {
    return (<MenuItem value={x.value} key={i}>{x.label}</MenuItem>);
  });

  return (
    <FormControl fullWidth>
      <Select
        variant="outlined"
        value={props.value.value}
      >
        {menuItems}
      </Select>
      <FormHelperText>{props.helperText}</FormHelperText>
    </FormControl>
  );
}


LabeledSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })),
  value: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }),
  helperText: PropTypes.string,
  handleChange: PropTypes.func
};


export default LabeledSelect;
