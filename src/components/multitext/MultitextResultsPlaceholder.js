/**
 * @fileoverview Placeholder over the results table before/during search.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports ResultsPlaceholder
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:redux
 * @requires NPM:react-redux
 * @requires NPM:@material-ui/core
 * @requires NPM:@material-ui/icons
 * @requires ../../../api/corpus
 */
import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { getSearchStatus, fetchResults } from '../../api/search';
import { initiateSearch as initiateMultitextSearch,
         getSearchStatus as getMultitextSearchStatus,
         fetchResults as fetchMultitextResults } from '../../api/multitext';
import { sleep, toTitleCase } from '../../utils';


/** CSS styles to apply to the component. */
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '100vh',
    flexDirection: "column",
    justifyContent: "center",
    paddingTop: '30%'
  },
  spacer: {
    display: 'block',
    marginTop: '25vh',
    marginLeft: '40%'
  },
  icon: {
    height: '20vh',
    marginLeft: '25px',
    width: '20vh'
  },
  text: {
    display: 'inline-block',
    fontSize: 18,
    marginTop: '20px'
  }
}));


/**
 * Placeholder content before/during a search.
 * @component
 * 
 * @example
 *   
 */
function MultitextResultsPlaceholder(props) {
  const { asyncReady, fetchMultitextResults, fetchResults,
          getMultitextSearchStatus, getSearchStatus, initiateMultitextSearch,
          multitextResults, multitextSearchID, multitextSearchInProgress, multitextSearchProgress, 
          multitextSearchStatus, multitextSelections, results, searchID,
          searchInProgress, searchProgress, searchStatus, unit } = props;

  /** CSS styles and global theme. */
  const classes = useStyles(props);

  // Either check for the status or get results from the REST API.
  if (searchInProgress) {

    // Ping the REST API for status every few seconds.
    if (searchStatus.toLowerCase() !== 'done') {
      (async () => {
        await sleep(250).then(() => {
          getSearchStatus(searchID, asyncReady);
        });
      })();
    }
    // Retrieve results if the status is "Done" and kick off the multitext part
    else {
      fetchResults(searchID, asyncReady);
    }
  }

  if (searchStatus.toLowerCase() === 'done' && isEmpty(multitextResults)) {
    console.log(multitextSearchStatus);
    if (multitextSearchID === '') {
      (async () => {
        await initiateMultitextSearch(searchID, multitextSelections, unit, asyncReady);
      })();
    }
    else if (multitextSearchStatus.toLowerCase() !== 'done') {
      (async () => {
        await sleep(250).then(() => {
          getMultitextSearchStatus(multitextSearchID, asyncReady);
        });
      })();
    }
    else {
      fetchMultitextResults(multitextSearchID, asyncReady);
    }
  }

  const progress = searchProgress.concat(multitextSearchProgress).map(item => {
    if (item !== undefined) {
      return (
        <div
          key={item.stage}
        >
          <Typography>{toTitleCase(item.stage)}:</Typography>
          <LinearProgress value={item.value * 100} variant= "determinate" />
        </div>
      );
    }
    else {
      return (<div></div>);
    }
  })


  // If a search is not in progress, an arrow pointing to the side bar is shown.
  // If a search is in progress, a spinning wheel is shown.
  return (
    <Hidden only={['xs', 'sm']}>
      <Box
        display="flex"
        flexGrow={1}
        flexDirection="row"
      >
        {!multitextSearchInProgress
         ?  <Box
              className={classes.spacer}
            >
              <ArrowBackIcon
                className={classes.icon}
                color="primary"
                style={{ fontSize: 9000 }}
                viewBox="4 4 18 18"
              />
              <br />
              <Typography
                className={classes.text}
                color="primary"
                variant="subtitle1">
                Run a search to find parallels.
              </Typography>
            </Box>
         :  <Box
              className={classes.spacer}
            >
              <Typography
                align="left"
                className={classes.text}
                color="primary"
                variant="subtitle1"
              >
                Searching. This may take a moment.
              </Typography>
              {progress}
            </Box>
        }
      </Box>
    </Hidden>
  );
}


MultitextResultsPlaceholder.propTypes = {
  /**
   * Flag determining if an AJAX call may be initiated.
   */
  asyncReady: PropTypes.bool,

  /**
   * Function to get results from the REST API.
   */
  fetchResults: PropTypes.func,

  /**
   * Function to get the status of the search from the REST API.
   */
  getSearchStatus: PropTypes.func,

  /**
   * List of results returned from the search.
   */
  results: PropTypes.arrayOf(PropTypes.object),

  /**
   * ID assigned to the search by the REST API.
   */
  searchID: PropTypes.string,

  /**
   * Progress indicators for stages of a search.
   */
  searchProgress: PropTypes.arrayOf(PropTypes.shape({
    /**
     * Name of the search stage.
     */
    stage: PropTypes.string,

    /**
     * Percent completion.
     */
    value : PropTypes.number
  })),

  /**
   * Search status string returned from the REST API.
   */
  searchStatus: PropTypes.string,
}


/**
 * Add redux store state to this component's props.
 * 
 * @param {object} state The global state of the application.
 * @returns {object} Members of the global state to provide as props.
 */
const mapStateToProps = state => ({
  asyncReady: state.async.asyncPending < state.async.maxAsyncPending,
  multitextResults: state.multitext.results,
  multitextSearchID: state.multitext.searchID,
  multitextSearchInProgress: state.async.multitextSearchInProgress,
  multitextSearchProgress: state.multitext.progress,
  multitextSearchStatus: state.multitext.status,
  multitextSelections: state.multitext.selectedTexts,
  results: state.search.results,
  resultCount: state.search.resultCount,
  searchID: state.search.searchID,
  searchInProgress: state.async.searchInProgress,
  searchStatus: state.search.searchStatus,
  searchProgress: state.search.searchProgress,
  unit: state.search.searchParameters.unitType
});


/**
 * Add redux store actions to this component's props.
 * @param {function} dispatch The redux dispatch function.
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  fetchMultitextResults: fetchMultitextResults,
  fetchResults: fetchResults,
  getMultitextSearchStatus: getMultitextSearchStatus,
  getSearchStatus: getSearchStatus,
  initiateMultitextSearch: initiateMultitextSearch,
}, dispatch)


// Do redux binding here.
export default connect(mapStateToProps, mapDispatchToProps)(MultitextResultsPlaceholder);