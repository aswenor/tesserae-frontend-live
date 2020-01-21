import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

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

import { fetchTextsPending, fetchTextsSuccess, fetchTextsError } from '../../../state_management/search/index2.js';

const useStyles = makeStyles({
  formControl: {
    minWidth: 120,
  }
});


function fetchTexts(language) {
  return dispatch => {
    dispatch(fetchTextsPending());
    axios({
      method: 'get',
      url: 'https://tess-new.caset.buffalo.edu/api/texts',
      responseType: 'json',
      params: {
        language: language
      }
    })
    .then(response => {
      dispatch(fetchTextsSuccess(response.data.texts));
      return response.data.texts;
    })
    .catch(error => {
      dispatch(fetchTextsError(error));
    });
  }
}


function SearchParametersForm(props) {
  const { availableTexts, language, sourceText, targetText } = props;
  const classes = useStyles();



  return (
    <section>
      <ExpansionPanel
        expanded={true}
      >
        <ExpansionPanelDetails>
          <Grid
            container
            spacing={2}
            justify="space-evenly"
          >
            <Grid item md={12} xs={12}>
              <TextSelectGroup
                selectedText={sourceText}
                textList={availableTexts}
                title="Source Text"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextSelectGroup
                selectedText={targetText}
                textList={availableTexts}
                title="Target Text"
              />
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
    availableTexts: state.availableTexts,
    language: state.language,
    sourceText: state.sourceText,
    targetText: state.targetText
  };
};


export default connect(mapStateToProps)(SearchParametersForm);
