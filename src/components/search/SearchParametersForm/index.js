import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import AdvancedOptionsGroup from '../AdvancedOptionsGroup'
import TextSelectGroup from '../TextSelectGroup';

import { updateLanguage, fetchTextsPending, fetchTextsSuccess,
         fetchTextsError, updateSourceText, updateTargetText } from '../../../state_management/search';

const useStyles = makeStyles({
  formControl: {
    minWidth: 120,
  }
});


function fetchTextsAction(language) {
  console.log('fetching texts');
  return dispatch => {
    dispatch(updateLanguage(language))
    dispatch(fetchTextsPending());
    axios({
      method: 'get',
      url: 'http://45.55.219.221:5000/texts',
      crossDomain: true,
      responseType: 'json',
      params: {
        language: language
      }
    })
    .then(response => {
      console.log(response);
      dispatch(fetchTextsSuccess(response.data.texts));
      return response.data.texts;
    })
    .catch(error => {
      dispatch(fetchTextsError(error));
    });
  }
}


function updateSourceTextAction(event, value, reason) {
  console.log(event);
  return dispatch => dispatch(updateSourceText(event.target.value));
}


function updateTargetTextAction(event, value, reason) {
  return dispatch => dispatch(updateTargetText(event.target.value));
}


function SearchParametersForm(props) {
  const { availableTexts, fetchTexts, fetchTextsPending, language,
          searchParameters, sourceText, targetText,
          updateSource, updateTarget } = props;
  const classes = useStyles();

  if (availableTexts.length === 0) {
    fetchTexts(language);
  }

  console.log(availableTexts);

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
                handleTextChange={updateSource}
                loading={fetchTextsPending}
                loadingText={`Loading ${language} corpus`}
                selection={sourceText}
                textList={availableTexts}
                title="Source Text"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextSelectGroup
                handleTextChange={updateTarget}
                loading={fetchTextsPending}
                loadingText={`Loading ${language} corpus`}
                selection={targetText}
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
    language: state.language,
    availableTexts: state.availableTexts,
    searchParameters: state.searchParameters,
    sourceText: state.sourceText,
    targetText: state.targetText
  };
};


const mapDispatchToProps = dispatch => bindActionCreators({
  fetchTexts: fetchTextsAction,
  updateSource: updateSourceTextAction,
  updateTarget: updateTargetTextAction
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchParametersForm);
