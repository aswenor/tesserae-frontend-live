import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


const useStyles = makeStyles({
  select: {
    marginTop: 10,
    marginLeft: '5%',
    width: '90%'
  }
});


function LabeledSelect(props) {
  const { handleChange, helperText, options, value } = props;
  const classes = useStyles();

  const menuItems = options.map((x, i) => {
    return (<MenuItem value={x.value} key={x.value}>{x.label}</MenuItem>);
  });

  return (
    <FormControl fullWidth>
      <Select
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


export default LabeledSelect;
