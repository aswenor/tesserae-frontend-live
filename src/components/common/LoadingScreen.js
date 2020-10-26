import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    height: '100vh'
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  spacer: {
    height: '25vh'
  }
}));


function LoadingScreen(props) {
  const classes = useStyles();

  return (
    <Grid container
      alignContent="center"
      alignItems="center"
      className={classes.root}
      direction="column"
      justify="center"
    >
      <Grid item xs={4}>
        <div className={classes.spacer}></div>
      </Grid>
      <Grid item xs={4}
        className={classes.spacer}
      >
        <div className={classes.spacer}>
          <Typography variant='h3'>
            Loading Corpus
          </Typography>
          <LinearProgress className={classes.progress} variant="indeterminate" />
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className={classes.spacer}></div>
      </Grid>
    </Grid>
  );
}


export default LoadingScreen;