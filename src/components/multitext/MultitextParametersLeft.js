import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMoreIcon';

import AdvancedOptionsGroup from '../search/AdvancedOptionsGroup';
import { MarginlessExpansionPanel, MarginlessExpansionPanelDetails, 
         MarginlessExpansionPanelSummary } from '../common/MarginlessExpansionPanel';
import SelectedMultitextList from './SelectedMultitextList';
import TextSelectGroup from '../search/TextSelectGroup';


function MultitextParametersLeft(props) {
  const classes = useState();

  return (
    <div
      className={classes.root}
    > 
      <MarginlessExpansionPanel
        className={classes.panel}
        expanded={true}
        square
      >
        <MarginlessExpansionPanelDetails>
          <TextSelectGroup />
        </MarginlessExpansionPanelDetails>
      </MarginlessExpansionPanel>
      <MarginlessExpansionPanel
        className={classes.panel}
        expanded={true}
        square
      >
        <MarginlessExpansionPanelSummary
          aria-controls="multitext-selections-form"
          expandIcon={<ExpandMoreIcon />}
          id="multitext-selections-header"
        >
          <Typography
            align="center"
            variant="h5"
          >
            Multitext Selections
          </Typography>
        </MarginlessExpansionPanelSummary>
        <MarginlessExpansionPanelDetails>
          <SelectedMultitextList />
        </MarginlessExpansionPanelDetails>
      </MarginlessExpansionPanel>
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
    </div>
  );
}