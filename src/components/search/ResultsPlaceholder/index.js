import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { getSearchStatusAction, fetchResultsAction } from '../../../api/corpus';


const useStyles = makeStyles(props => theme => ({
    root: {
        display: 'flex',
        height: 100,
        flexDirection: "column",
        justifyContent: "center"
    },
    spacer: {
        height: '30vh'
    }
}));


function AwaitingSearchCard(props) {
    return (
        <Card>
            <CardMedia>
                <ArrowBackIcon />
            </CardMedia>
            <CardContent>
                <Typography variant="subtitle1">
                    Run a Search to find parallels.
                </Typography>
            </CardContent>
        </Card>
    );
}


function SearchInProgressCard(props) {
    return (
        <Card>
            <CardMedia>
                <CircularProgress />
            </CardMedia>
            <CardContent>
                <Typography variant="subtitle1">
                    Finding parallels.
                </Typography>
            </CardContent>
        </Card>
    );
}


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

    const card = !searchInProgress ? <AwaitingSearchCard /> : <SearchInProgressCard />;

    return (
        <div className={classes.root}>
            {card}
        </div>
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