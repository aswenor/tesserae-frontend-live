import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';

import { initiateSearch } from '../../api/search';
import { clearResults, clearSearchMetadata,
         updateSourceText, updateTargetText } from '../../state/search';

import AdvancedOptionsGroup from '../search/AdvancedOptionsGroup';
import { MarginlessExpansionPanel, MarginlessExpansionPanelDetails,
         MarginlessExpansionPanelSummary } from '../common/MarginlessExpansionPanel';
import SelectedMultitextList from './SelectedMultitextList';
import MultitextSelector from './MultitextSelector';
import TextSelectGroup from '../search/TextSelectGroup';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  }
}));


function MultitextParametersForm(props) {
  const { asyncReady, availableTexts, language, searchNeeded, searchParameters, sourceText, stopwords, targetText } = props;

  const classes = useStyles();

  const clearAndInitiate = () => {
    if (searchNeeded) {
      clearResults();
      initiateSearch(sourceText, targetText, searchParameters,
                    stopwords, asyncReady);
    }
  };

  const shouldFetchTexts = asyncReady && availableTexts.length === 0;
  const disableSearch = stopwords.length === 0
                        || sourceText.object_id === undefined
                        || targetText.object_id === undefined;


  return (
    <div
      className={classes.root}
    >
      <Grid container
        alignContent="center"
        direction="column"
      >
        <Grid item sm={6}>
          <MarginlessExpansionPanel
            className={classes.panel}
            expanded={true}
            square
          >
            <MarginlessExpansionPanelDetails
            >
              <Grid container
                alignContent="center"
                alignItems="center"
                justify="flex-start"
                spacing={2}
              >
                <Grid item xs={12}>
                  <TextSelectGroup />
                </Grid>
                <Grid item
                  align="center"
                  xs={12}
                >
                  <Fab
                    color="primary"
                    disabled={disableSearch}
                    onClick={clearAndInitiate}
                    variant="extended"
                  >
                    <SearchIcon /> Search
                  </Fab>
                </Grid>
                <Grid item xs={12}>
                  <SelectedMultitextList />
                </Grid>
              </Grid>
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
        </Grid>
        <Divider
          orientation="vertical"
        />
        <Grid item sm={6}>
          <MultitextSelector />
        </Grid>
      </Grid>

    </div>
  );
}


MultitextParametersForm.propTypes = {};


/**
 * Add redux store state to this component's props.
 * 
 * @param {object} state The global state of the application.
 * @returns {object} Members of the global state to provide as props.
 */
const mapStateToProps = (state) => {
  return {
    asyncReady: state.async.asyncPending < state.async.maxAsyncPending,
    availableTexts: state.corpus.availableTexts,
    language: state.corpus.language,
    searchNeeded: state.search.searchID === '',
    searchParameters: state.search.searchParameters,
    sourceText: state.search.sourceText,
    stopwords: state.search.stopwords,
    targetText: state.search.targetText,
  };
};


/**
 * Add redux store actions to this component's props.
 * @param {function} dispatch The redux dispatch function.
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  clearResults: clearResults,
  clearSearchMetadata: clearSearchMetadata,
  initiateSearch: initiateSearch,
  updateSource: updateSourceText,
  updateTarget: updateTargetText
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(MultitextParametersForm);