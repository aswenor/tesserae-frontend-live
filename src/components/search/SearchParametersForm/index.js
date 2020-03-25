import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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

import { fetchStoplistAction, fetchTextsAction,
         updateSourceTextAction, updateTargetTextAction } from '../../../api/corpus';

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: 120,
  }
}));


function SearchParametersForm(props) {
  const { availableTexts, disableSearch, fetchTexts, fetchStoplist, language,
          pending, searchParameters, shouldFetchTexts, sourceText, targetText,
          updateSource, updateTarget } = props;

  const classes = useStyles();

  const basis = (searchParameters !== undefined && searchParameters.stoplistBasis === 'corpus'
                 ? language
                 : [sourceText.object_id, targetText.object_id]);

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
                loading={pending}
                loadingText={
                  <Typography variant="h6">
                    <CircularProgress />{`Loading ${language} corpus`}
                  </Typography>
                }
                onOpen={() => fetchTexts(language, shouldFetchTexts)}
                selection={sourceText}
                textList={availableTexts}
                title="Source Text"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextSelectGroup
                handleTextChange={updateTarget}
                loading={pending}
                loadingText={
                  <Typography variant="p">
                    <CircularProgress />{`Loading ${language} corpus`}
                  </Typography>
                }
                onOpen={() => fetchTexts(language, shouldFetchTexts)}
                selection={targetText}
                textList={availableTexts}
                title="Target Text"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                color="primary"
                disabled={disableSearch}
                onClick={() => fetchStoplist(searchParameters.feature, parseInt(searchParameters.stoplist, 10), basis, pending)}
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
    disableSearch: state.disableSearch,
    language: state.language,
    pending: state.asyncPending,
    searchParameters: state.searchParameters,
    shouldFetchStoplist: state.shouldFetchStoplist,
    shouldFetchTexts: state.shouldFetchTexts,
    sourceText: state.sourceText,
    stopwords: state.stopwords,
    targetText: state.targetText,
  };
};


const mapDispatchToProps = dispatch => bindActionCreators({
  fetchTexts: fetchTextsAction,
  fetchStoplist: fetchStoplistAction,
  updateSource: updateSourceTextAction,
  updateTarget: updateTargetTextAction
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchParametersForm);
