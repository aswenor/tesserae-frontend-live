import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import TextInput from '@material-ui/core/TextInput';


function IngestForm(props) {
  return (
    <FormControl
      color="secondary"
      component="fieldset"
    >
      <FormLabel
        component="legend"
      >
        Submit a Text for Ingest
      </FormLabel>
      <FormGroup
        aria-label="file upload"
        row
      >
        <FormControlLabel
          control={
            <Input
              
              type="file"
            />
          }
          value=""
        />
      </FormGroup>
    </FormControl>
  );
}


export default IngestForm;