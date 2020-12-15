import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

import MenuIcon from '@material-ui/icons/Menu';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    border: '1px solid black',
    display: props => props.open ? 'auto' : 'none',
    marginLeft: theme.spacing(3),
    marginTop: theme.spacing(3),
    position: 'absolute', 
    zIndex: theme.zIndex.modal,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  }
}));


function OpenSidebarButton(props) {
  const { handleClose, open } = props;

  const classes = useStyles(props);

  return (
    <IconButton
      className={classes.root}
      color="secondary"
      onClick={handleClose}
      variant="filled"
    >
      <MenuIcon color="action" />
    </IconButton>
  );
}


OpenSidebarButton.propTypes = {
  handleClose: PropTypes.func,
  open: PropTypes.bool,
};


export default OpenSidebarButton;
