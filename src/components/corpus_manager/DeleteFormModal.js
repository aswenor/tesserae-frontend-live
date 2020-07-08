import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';


const useStyles = makeStyles(theme => ({}));


function DeleteFormModal(props) {
  const { deleteCount, handleClose, handleDelete, open } = props;

  const classes = useStyles();

  return (
    <Modal
      aria-describedby="confirm-delete-texts"
      aria-labelledby="delete-warning"
      open={open}
      onClose={handleClose}
      onEscapeKeyDown={handleClose}
    >
      <Grid container>
        <Grid item xs={12}>
          <Typography
            variant="h3"
          >
            Permanently Delete Texts?
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="body1"
          >
            Warning! You are about to remove {deleteCount} texts from the database.
            This will remove all feature and search data related to these texts.
            This action cannot be undone.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Fab
            onClick={handleDelete}
            variant="extended"
          >
            <DeleteIcon />
            Delete
          </Fab>
          <Fab
            onClick={handleClose}
            variant="extended"
          >
            <CloseIcon />
            Cancel
          </Fab>
        </Grid>
      </Grid>
    </Modal>
  );
}


DeleteFormModal.propTypes = {
  deleteCount: PropTypes.number,
  handleClose: PropTypes.func,
  handleDelete: PropTypes.func,
  open: PropTypes.bool,
}


export default DeleteFormModal;