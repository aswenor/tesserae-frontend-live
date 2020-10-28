/**
 * @fileoverview Form to confirm text deletion.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports CorpusViewerHeader
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:redux
 * @requires NPM:react-redux
 * @requires NPM:@material-ui/core
 * @requires NPM:@material-ui/icons
 * @requires ../../api/corpus
 */
import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';

import CloseIcon from '@material-ui/icons/Close';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import { deleteTexts } from '../../api/corpus';
import ThemedDialog from '../common/ThemedDialog';


const useStyles = makeStyles(theme => ({
  removeButton: {
    marginRight: theme.spacing(2)
  }
}));


/**
 * Form to confirm text deletion.
 * 
 * @component 
 */
function ConfirmDelete(props) {
  const { closeDialog, deleteTexts, open, selectedText } = props;

  const classes = useStyles();

  const message = 'Are you sure you want to remove'.concat(
    ` ${selectedText.author} - ${selectedText.title} `,
    'from the corpus? This action cannot be undone.'
  );

  const submitAndClose = () => {
    deleteTexts([selectedText.object_id]);
    closeDialog();
  };

  return (
    <ThemedDialog
      actions={
        <div>
          <Fab
            className={classes.removeButton}
            onClick={submitAndClose}
            variant="extended"
          >
            <DeleteForeverIcon /> Remove
          </Fab>
          <Fab
            onClick={closeDialog}
            variant="extended"
          >
            <CloseIcon /> Cancel
          </Fab>
        </div>
      }
      body={message}
      closeDialog={closeDialog}
      open={open}
      title="Confirm Removal"
    />
  );
}


/**
 * Add redux store actions to this component's props.
 * 
 * @param {function} dispatch The redux dispatch function.
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    deleteTexts: deleteTexts
  }, dispatch);
}


// Do redux binding here.
export default connect(null, mapDispatchToProps)(ConfirmDelete);