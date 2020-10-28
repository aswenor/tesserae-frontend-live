/**
 * @fileoverview Styled file upload input.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports FileUpload
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:@material-ui/core
 */
import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

 
/** CSS styles to apply to the component. */
const useStyles = makeStyles(theme => ({
  root: {
    padding: 0
  },
  button: {
    margin: 0,
    marginRight: theme.spacing(1)
  },
  field: {
    backgroundColor: '#ffffff',
    margin: 0,
  }
}));


/**
 * Styled file upload input.
 * 
 * @component
 * @example
 *  import DoneIcon from '@material-ui/core/Done';
 *  
 *  let file = '';
 * 
 *  return (
 *    <FileUpload
 *      buttonIcon={<DoneIcon />}
 *      buttonText="Browse"
 *      file={file}
 *      setFile={(event) => {file = event.target.files[0]}}
 *    />
 *  );
 */
function FileUpload(props) {
  const { buttonIcon, buttonText, file, setFile } = props;

  /** CSS styles and global theme. */
  const classes = useStyles();

  return (
    <Box
      alignContent="center"
      alignItems="center"
      display="flex"
      justifyContent="center"
      justifyItems="center"
      p={0}
      width={1}
    >
      <input
        accept="image/*,.tess"
        id="contained-button-file"
        onChange={(event) => setFile(event.target.files[0])}
        style={{display: 'none'}}
        type="file"
      />
      <label
        for="contained-button-file"
      >
        <Button
          className={classes.button}
          color="primary"
          component="span"
          size="large"
          variant="contained"
        >
          {buttonIcon} {buttonText}
        </Button>
      </label>
      <TextField
        className={classes.field}
        disabled
        fullWidth
        value={file.name}
        variant="outlined"
      />
    </Box>
  );
}


FileUpload.propTypes = {
  /**
   * Icon to display on the button.
   */
  buttonIcon: PropTypes.element,

  /**
   * Text to display on the upload button.
   */
  buttonText: PropTypes.string,

  /**
   * File object representing the selected file and metadata.
   */
  file: PropTypes.object,

  /**
   * Function to set the selected File object.
   */
  setFile: PropTypes.func
};


export default FileUpload;