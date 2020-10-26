import axios from 'axios';
import { forIn, maxBy } from 'lodash';

import { initiateAsync, clearAsync,
         registerError, updateMultitextInProgress } from '../state/async';
import { updateResults, updateSearchID, updateStatus } from '../state/multitext';


/**
 * URL of the REST API as defined in the environment.
 */
const REST_API = process.env.REACT_APP_REST_API_URL;


function normalizeScores(parallels, maxScore = 10) {
  const normedParallels = parallels.map(item => {
    const newScore = Math.round((item.score * 10) / maxScore);
    return {
      ...item,
      score: newScore <= 10 ? newScore : 10
    }
  });

  return normedParallels;
}


export function initiateSearch(searchID, multitextSelections, unit, asyncReady) {
  return dispatch => {
    // Only kick off a request to the REST API if no other requests are active.
    if (asyncReady) {
      // Update app state to show there is a new async action.
      dispatch(initiateAsync());
      console.log('initiating multitext', searchID, multitextSelections, unit);

      // Start a request to the parallels endpoint of the REST API.
      // This creates a Promise that resolves when a reqponse or error is received.
      axios({
          method: 'post',
          url: `${REST_API}/multitexts/`,
          crossDomain: true,
          headers: {
            contentType: 'x-www-form-urlencoded'
          },
          responseType: 'json',
          cacheControl: 'no-store',
          data: {
            parallels_uuid: searchID,
            unit_type: unit,
            text_ids: multitextSelections.map(item => item.object_id),
          }
      })
      .then(response => {
        let searchID = '';
        dispatch(clearAsync());
        
        if (response.headers.location !== undefined) {
          searchID = response.headers.location.split('/').slice(-2)[0];
          dispatch(updateSearchID(searchID));
          console.log('after location', searchID, response.headers.location.split('/').slice(-2)[0]);
        }

        if (response.request.responseURL !== undefined && searchID === '') {
          searchID = response.request.responseURL.split('/').slice(-2)[0];
          dispatch(updateSearchID(searchID));
          console.log('after responseurl', searchID, response.request.responseURL.split('/').slice(-2)[0]);
        }

        dispatch(updateMultitextInProgress(true));
        
        return searchID;
      })
      .catch(error => {
        // On error, update the error log.
        dispatch(clearAsync());
        dispatch(registerError(error));
      });
    }
  };
}


/**
 * Ping the REST API to get the status of a search.
 * 
 * @param {String} searchID The ID of the search obained when it was initiated.
 * @param {boolean} pending True if any AJAX calls are in progress.
 * @returns {function} Callback that calls dispatch to handle communication.
 */
export function getSearchStatus(searchID, asyncReady) {
  return dispatch => {
    // Only kick off a request to the REST API if no other requests are active.
    if (asyncReady) {
      // Update app state to show there is a new async action.
      dispatch(initiateAsync());

      // Start a request to the parallels endpoint of the REST API.
      // This creates a Promise that resolves when a reqponse or error is received.
      axios({
        method: 'get',
        url: `${REST_API}/multitexts/${searchID}/status/`,
        crossDomain: true,
        responseType: 'json',
        cacheControl: 'no-store'
      })
      .then(response => {
        // On success, update the global state and return the status.
        dispatch(clearAsync());

        if (response.data.status !== undefined) {
          dispatch(updateStatus(response.data.status, response.data.progress, response.data.message));
          
          if (response.data.status.toLowerCase() === 'done') {
            dispatch(updateMultitextInProgress(false));
          }
        }
        return response.data.status;
      })
      .catch(error => {
        // On error, update the error log.
        dispatch(clearAsync());
        dispatch(registerError(error));
      })
    }
  }
}


/**
 * Fetch available texts of the selected language from the REST API.
 * 
 * @param {String} searchID The ID of the search obained when it was initiated.
 * @param {boolean} asyncReady True if the app is ready to send a request.
 * @param {number} currentPage The page of results to fetch.
 * @param {number} rowsPerPage The number of rows to fetch.
 * @param {String} sortLabel The table header to sort by.
 * @param {number} sortOrder 1 (asc) or -1 (desc)
 * @returns {function} Callback that calls dispatch to handle communication.
 */
export function fetchResults(searchID, asyncReady, currentPage = 0,
                             rowsPerPage = 100, sortLabel = 'score',
                             sortOrder = -1) {
  return dispatch => {
    // Only kick off a request to the REST API if no other requests are active.
    if (asyncReady) {
      // Update app state to show there is a new async action.
      dispatch(initiateAsync());

      // Start a request to the parallels endpoint of the REST API.
      // This creates a Promise that resolves when a reqponse or error is received.
      axios({
        method: 'get',
        url: `${REST_API}/multitexts/${searchID}/`,
        crossDomain: true,
        responseType: 'json',
        cacheControl: 'no-store',
        params: {
          search_id: searchID,
          page_number: currentPage,
          per_page: rowsPerPage,
          sort_by: sortLabel,
          sort_order: sortOrder === -1 ? 'descending' : 'ascending',
        }
      })
      .then(response => {
        // On success, update the global state and return the results.
        // Because of strange design constraints and group consensus, normalize
        // all scores to be in range [0, 10].
        let results = response.data.multiresults;
        // let normedResults = {};
        // forIn(results, (value, key) => {
        //   const maxScore = maxBy(value, 'score');
        //   normedResults[key] = normalizeScores(value, maxScore > 10 ? maxScore : 10);
        // });
        // dispatch(clearAsync());
        dispatch(updateResults(results));
        return results;
      })
      .catch(error => {
        // On error, update the error log.
        dispatch(clearAsync());
        dispatch(registerError(error));
      });
    }
  }
}