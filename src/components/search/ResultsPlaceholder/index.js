import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { getSearchStatusAction, fetchResultsAction } from '../../../api/corpus';


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
    // color: "#aeaeae",
    display: 'inline-block',
    fontSize: 18,
    marginTop: '20px'
  }
}));


function ResultsPlaceholder(props) {
  const { asyncPending, fetchResults, getSearchStatus, results, searchID,
          searchInProgress, shouldInitiateSearch, status } = props;
  const classes = useStyles(props);

  if (results.length === 0) {
    if (searchInProgress && (status === null || status.toLowerCase() !== 'done')) {
      setTimeout(() => getSearchStatus(searchID, asyncPending), 500);
    }
    
    if (!searchInProgress && status !== null && status.toLowerCase() === 'done') {
      fetchResults(searchID, asyncPending);
    }
  }

  return (
    <Hidden only={['xs', 'sm']}>
      <Box
        display="flex"
        flexGrow={1}
        flexDirection="row"
      >
        {!searchInProgress
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
              <CircularProgress
                className={classes.icon}
                thickness={2.5}
                size={'20vh'}
              />
              <br />
              <Typography
                align="left"
                className={classes.text}
                color="primary"
                variant="subtitle1"
              >
                Searching. This may take a moment.
              </Typography>
            </Box>
        }
      </Box>
    </Hidden>
  );
}


const mapStateToProps = state => ({
  asyncPending: state.asyncPending,
  results: state.results,
  searchID: state.searchID,
  searchInProgress: state.searchInProgress,
  shouldInitiateSearch: state.shouldInitiateSearch,
  status: state.status
});


const mapDispatchToProps = dispatch => bindActionCreators({
  fetchResults: fetchResultsAction,
  getSearchStatus: getSearchStatusAction,
}, dispatch)



export default connect(mapStateToProps, mapDispatchToProps)(ResultsPlaceholder);