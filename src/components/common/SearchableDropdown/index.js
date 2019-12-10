import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';


// const useStyles = makeStyles(theme => ({
//   select: {
//     marginTop: 10,
//     marginLeft: '5%',
//     width: '90%'
//   }
// }));


function SearchableDropdown(props) {
  const { onChange, helperText, options, placeholder, value } = props;

  return (
      <FormControl fullWidth>
        <Autocomplete
          getOptionLabel={option => option.label}
          onChange={onChange}
          options={options}
          placeholder={placeholder}
          renderInput={params => (
            <TextField {...params} label={placeholder} variant="outlined" fullWidth />
          )}
        />
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
  );
};


SearchableDropdown.propTypes = {
  onChange: PropTypes.func,
  helperText: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string
  })),
  placeholder: PropTypes.string,
  value: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string
  })
};


export default SearchableDropdown;
