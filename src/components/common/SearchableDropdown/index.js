import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from 'react-select';
import NoSsr from '@material-ui/core/NoSsr';


const useStyles = makeStyles(theme => ({
  select: {
    marginTop: 10,
    marginLeft: '5%',
    width: '90%'
  }
}));


function SearchableDropdown(props) => {
  return (
      <FormControl className={props.classes.select} fullWidth>
        <NoSsr>
          <Select
            className={props.classes.select}
            value={props.value}
            onChange={props.handleChange}
            placeholder={props.placeholder}
            isClearable
          >
            { ...children }
          </Select>
        </NoSsr>
        <FormHelperText>{props.helperText}</FormHelperText>
      </FormControl>
  );
};


SearchDropdown.propTypes = {
  handleChange: PropTypes.func,
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
