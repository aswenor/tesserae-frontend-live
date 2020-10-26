import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    margin: '5%',
    padding: theme.spacing(6),
    [theme.breakpoints.up('md')]: {
      width: '50%'
    },
    [theme.breakpoints.down('sm')]: {
      width: '95%'
    },
  },
  innerGrid: {
    marginTop: '10px'
  },
  titleText: {
    marginBottom: '10px'
  }
}));


function ConfirmDelete(props) {
  const { closeModal, deleteText, selectedText } = props;

  const classes = useStyles();

  return (
    <Grid container
      alignItems="center"
      justify="center"
      display="flex"
    >
      <Grid item md={4} xs={1}></Grid>
      <Grid item
        md={8}
        xs={10}
      >
        <Paper className={classes.root}>
          <Grid container
            alignItems="center"
            direction="column"
            justify="center"
            spacing={0}
          >
            <Typography
              className={classes.titleText}
              variant="h4"
            >
              Confirm Removal
            </Typography>        
            <Typography>
              Are you sure you want to remove "{selectedText.author}" - "{selectedText.title}"
              from the corpus? This action cannot be undone.
            </Typography>
            <Grid container
              alignContent="center"
              alignItems="center"
              className={classes.innerGrid}
              justify="center"
            >
              <Grid item sm={3} xs={1}></Grid>
              <Grid item sm={3} xs={12}>
                <Fab variant="extended">Remove</Fab>
              </Grid>
              <Grid item sm={3} xs={12}>
                <Fab
                  onClick={closeModal}
                  variant="extended"
                >
                  Cancel
                </Fab>
              </Grid>
              <Grid item sm={3} xs={1}></Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item md={2} xs={1}></Grid>
    </Grid>
  );
}


export default ConfirmDelete;