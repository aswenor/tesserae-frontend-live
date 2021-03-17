/**
 * @fileoverview Dialog window announcing the new version.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports NewVersionDialog
 * 
 * @requires NPM:react
 * @requires NPM:@material-ui/core
 * @requires NPM:@material-ui/icons
 * @requires ./ThemedDialog
 */
import React, { useState } from 'react';
import isElectron from 'is-electron';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';

import ThemedDialog from './ThemedDialog';


/**
 * CSS styling
 */
const useStyles = makeStyles((theme) => ({
  spacer: {
    marginBottom: theme.spacing(2)
  }
}));


/**
 * Dialog announcing the new Tesserae version.
 * 
 * @component
 * @example
 *   const storage = window.localStorage();
 *   storage.setItem('v5_new_first_view', 'true');
 *   
 *   return (<NewVersionDialog />);
 */
function NewVersionDialog(props) {
  const classes = useStyles();

  /** Domain-specific persistent browser storage. Keys and values must be strings */
  const storage = window.localStorage;

  /** Do not show the dialog if true. Deactivates the dialog if the user requests. */
  const dns = storage.getItem('v5_new_show_dialog') ? storage.getItem('v5_new_show_dialog') : 'false';

  /** Flag to ensure the dialog is only shown on the first page visited. */
  const first = storage.getItem('v5_new_first_view');

  const [ open, setOpen ] = useState(dns === 'false' && first === 'true');
  const [ checked, setChecked ] = useState(false);
  
  /**
   * Set the checkbox and global DNS value.
   * 
   * @param {Event} event The onChange event.
   */
  const onCheck = (event) => {
    storage.setItem('v5_new_show_dialog', event.target.checked ? 'true' : 'false');
    setChecked(event.target.checked);
  };

  /**
   * Close the dialog and prevent it from opening again on this visit.
   * 
   * @param {Event} event The onClick/onClose event.
   */
  const onClose = (event) => {
    storage.setItem('v5_new_first_view', 'false');
    setOpen(false);
  }

  return (
    <ThemedDialog
      actions={
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                color="primary"
                onChange={onCheck}
              />
            }
            label="Do not show this again"
          />
          <Button
            onClick={onClose}
          >
            <CloseIcon />Close
          </Button>
        </div>
      }
      body={
        <div>
          <Typography className={classes.spacer} variant="body1">
            We have updated Tesserae to a new version (Version 5). The update is meant to improve the user experience with a more modern interface. It also offers a corpus view that allows users to see all the texts in the Tesserae corpus and choose which ones to compare. It includes a web API that allows other online services to request the Tesserae server to run searches.
          </Typography>
          <Typography className={classes.spacer} variant="body1">
            This update was also necessitated by the age of <a href="https://tesseraev3.caset.buffalo.edu/">the original Tesserae (Version 3) system</a>. Version 3 was written in Perl and with flat files for data storage, and is coming to the end of its functional life. The new version is written in Javascript and Python, and uses a MongoDB database. This new basis should allow for easier updates and improvements going forward.
          </Typography>
          <Typography variant="body1">
          Version 5 is a work in progress and we ask for your patience with any issues as we make fixes and improvements. The previous version of Tesserae (Version 3) will be updated to continue its functionality and a link to it will be made available in Version 5, so users can continue working with the <a href="https://tesseraev3.caset.buffalo.edu/">Version 3</a> system for the time being.
          </Typography>
        </div>
      }
      closeDialog={onClose}
      open={open}
      title="Welcome to the new Tesserae!"
    />
  );
}


export default NewVersionDialog;