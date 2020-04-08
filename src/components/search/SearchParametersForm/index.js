import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import AdvancedOptionsGroup from '../AdvancedOptionsGroup'
import TextSelectGroup from '../TextSelectGroup';

import { fetchStoplistAction, fetchTextsAction,
         updateSourceTextAction, updateTargetTextAction } from '../../../api/corpus';

const useStyles = makeStyles(theme => ({
  topBox: {
    '&$expanded': {
      marginTop: -2,
      paddingTop: 0
    }
  },
  bottomBox: {
    '&$expanded': {
      marginTop: -2,
      paddingTop: 0
    }
  }
}));


const ExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    width: '100%',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiExpansionPanel);


const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);


const ExpansionPanelDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiExpansionPanelDetails);


function SearchParametersForm(props) {
  const { availableTexts, disableSearch, fetchTexts, fetchStoplist, language,
          pending, searchParameters, shouldFetchTexts, sourceText, targetText,
          updateSource, updateTarget } = props;

  const classes = useStyles();

  const basis = (searchParameters !== undefined && searchParameters.stoplistBasis === 'corpus'
                 ? language
                 : [sourceText.object_id, targetText.object_id]);

  return (
    <Box
      component="section"
      display="flex"
      flexDirection="column"
      flexGrow={1}
      width={1}
    >
      <ExpansionPanel
        expanded={true}
      >
        <ExpansionPanelDetails
        >
          <Grid container
            alignContent="center"
            alignItems="center"
            justify="flex-start"
            spacing={2}
          >
            <Grid item
              align="center"
              xs={12}
            >
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
            <Grid item 
              align="center"
              xs={12}
            >
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
            <Grid item
              align="center"
              xs={12}
            >
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
    </Box>
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
