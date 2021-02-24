import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import UnitDisplay from './UnitDisplay';


const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    // overflowX: 'hidden',
    overflow: 'scroll'
  }
}));


function TextDisplay(props) {
  const { units } = props;

  const classes = useStyles();

  const unitRows = units.map(item => {
    return (
      <UnitDisplay
        highlight={item.highlight}
        snippet={item.snippet}
        tag={item.tags}
      />
    );
  });

  return (
    <Grid container
      alignContent="center"
      alignItems="center"
      className={classes.root}
      justify="center"
      spacing={2}
    >
      {unitRows}
    </Grid>
  );
}


export default TextDisplay;