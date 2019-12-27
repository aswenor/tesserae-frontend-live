import React from 'react';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import AdvancedOptionsGroup from '../AdvancedOptionsGroup'
import TextSelectGroup from '../TextSelectGroup';
import { stat } from 'fs';


const useStyles = makeStyles({
  formControl: {
    minWidth: 120,
  }
});


function SearchParametersForm(props) {
  return (
    <section>
      <ExpansionPanel
        expanded={true}
      >
        {/* <ExpansionPanelSummary
          aria-controls="select-text-form"
          id="select-text-header"
          >
          <Typography
            align="left"
            variant="h5"
            >
            Select Texts to Search
          </Typography>
        </ExpansionPanelSummary> */}
        <ExpansionPanelDetails>
          <Grid
            container
            spacing={2}
            justify="space-evenly"
          >
            <Grid item md={12} xs={12}>
              <TextSelectGroup title="Source Text" language={props.language} />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextSelectGroup title="Target Text" language={props.language} />
            </Grid>
            <Grid item xs={12}>
              <Button
                color="primary"
                variant="contained"
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
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
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <AdvancedOptionsGroup />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </section>
  );
}

const mapStateToProps = (state) => {
  return {
    language: state.searchParameters.language,
    texts: state.searchParameters.texts
  };
};


export default connect(mapStateToProps)(SearchParametersForm);
