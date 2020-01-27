import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';


const useStyles = makeStyles(theme => ({
  select: {
    marginTop: 10,
    marginLeft: '5%',
    width: '90%'
  }
}));


function SearchableDropdown(props) {
  const { getOptionLabel, helperText, onChange, options,
          placeholder, value } = props;
  const classes = useStyles();

  return (
      <FormControl fullWidth>
        <Autocomplete
          getOptionLabel={getOptionLabel}
          onChange={onChange}
          options={options}
          placeholder={placeholder}
          renderInput={params => (
            <TextField {...params}
              label={placeholder}
              variant="outlined"
              fullWidth
            />
          )}
        />
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
  );
};


export default SearchableDropdown;
