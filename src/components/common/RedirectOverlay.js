/**
 * @fileoverview Delayed redirect with a screen overlay.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports RedirectOverlay
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:react-router-dom
 * @requires NPM:@material-ui/core
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

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


function RedirectOverlay(props) {
  const { delay, displayText, to } = props;

  const classes = useStyles();

  const history = useHistory();

  const [timer, setTimer] = useState(null);
  
  if (!timer) {
    setTimer(setTimeout(() => history.push(to), delay * 1000));
  }

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
          <Typography variant="h3">
            {displayText}
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


RedirectOverlay.propTypes = {
  /**
   * Redirect delay in seconds.
   */
  delay: PropTypes.number,

  /**
   * Text to display before redirect.
   */
  displayText: PropTypes.string,

  /**
   * Redirect destination URL.
   */
  to: PropTypes.string
};


export default RedirectOverlay;