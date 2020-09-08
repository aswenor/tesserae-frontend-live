import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import AdvancedOptionsGroup from '../search/AdvancedOptionsGroup';
import { MarginlessExpansionPanel, MarginlessExpansionPanelDetails, 
         MarginlessExpansionPanelSummary } from '../common/MarginlessExpansionPanel';
import SelectedMultitextList from './SelectedMultitextList';
import TextSelectGroup from '../search/TextSelectGroup';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    overflowY: 'scroll',
  },
  mtContainer: {
    marginTop: theme.spacing(2)
  }
}));


function MultitextParametersLeft(props) {
  const classes = useStyles();

  return (
    <Grid container
      alignContent="center"
      alignItems="center"
      justify="center"
    >
      <Grid item xs={12}>
        <MarginlessExpansionPanel
          className={classes.panel}
          expanded={true}
          square
        >
          <MarginlessExpansionPanelDetails>
            <Grid container>
              <Grid item xs={12}>
                <TextSelectGroup />
              </Grid>
              <Grid item xs={12}
                className={classes.mtContainer}
              >
                <SelectedMultitextList />
              </Grid>
            </Grid>
          </MarginlessExpansionPanelDetails>
        </MarginlessExpansionPanel>
      </Grid>
      <Grid item xs={12}>
        <MarginlessExpansionPanel
            className={classes.panel}
            square
          >
            <MarginlessExpansionPanelSummary
              aria-controls="advanced-options-form"
              expandIcon={<ExpandMoreIcon />}
              id="advanced-options-header"
            >
              <Typography
                align="center"
                variant="h5"
              >
                Advanced Options
              </Typography>
            </MarginlessExpansionPanelSummary>
            <MarginlessExpansionPanelDetails>
              <AdvancedOptionsGroup />
            </MarginlessExpansionPanelDetails>
          </MarginlessExpansionPanel>
        </Grid>
    </Grid>
  );
}


export default MultitextParametersLeft;