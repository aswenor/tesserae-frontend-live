/**
 * @fileoverview Search interactions with the REST API.
 * 
 * @author Jeff Kinnison <jkinniso@nd.edu>
 *
 * @exports updateSourceText
 * @exports updateTargetText
 * @exports updateSearchParameters
 * @exports fetchStoplist
 * @exports initiateSearch
 * @exports getSearchStatus
 * @exports fetchResults
 * 
 * @requires NPM:axios
 * @requires NPM:lodash
 * @requires ../state/async
 * @requires ../state/search
 */
import axios from 'axios';
import maxBy from 'lodash/maxBy';

import { initiateAsync, clearAsync,
         registerError } from '../state/async';
import { updateResults, updateSearchID, updateSearchStatus,
         updateStopwords } from '../state/search';


/**
 * URL of the REST API as defined in the environment.
 */
const REST_API = process.env.REACT_APP_REST_API_URL;


function normalizeScores(parallels) {
  const maxScore = Math.max(maxBy(parallels, x => x.score).score, 10);
  
  const normedParallels = parallels.map(item => {
    const newScore = Math.round((item.score * 10) / maxScore);
    return {
      ...item,
      score: newScore <= 10 ? newScore : 10
    }
  });

  return normedParallels;
}


/**
 * Fetch the stoplist from the REST API with selected parameters.
 * 
 * @param {String} feature The token feature of the search.
 * @param {number} stopwords The size of the stoplist to create.
 * @param {String|String[]} stoplistBasis The source of frequency data.
 * @param {boolean} pending True if any AJAX calls are in progress.
 * @returns {function} Callback that calls dispatch to handle communication.
 */
export function fetchStoplist(feature, stopwords, stoplistBasis, pending) {
  return dispatch => {
    // Only kick off a request to the REST API if no other requests are active.
    if (!pending) {
      // Update app state to show there is a new async action.
      dispatch(initiateAsync());

      /** Parameters to send to the endpoint. */
      let params = {
        feature: feature,
        list_size: stopwords,
      };

      // Different stoplist bases have different nomenclature, so handle accordingly.
      if (stoplistBasis instanceof Array) {
        params.works = stoplistBasis;
      }
      else {
        params.language = stoplistBasis;
      }

      // Start a request to the stopwords endpoint of the REST API.
      // This creates a Promise that resolves when a reqponse or error is received.
      axios({
        method: 'get',
        url: `${REST_API}/stopwords`,
        crossDomain: true,
        responseType: 'json',
        params: params
      })
      .then(response => {
        // On success, update the global state and return the stoplist.
        dispatch(updateStopwords(response.data.stopwords));
        dispatch(clearAsync());
        return response.data.stopwords
      })
      .catch(error => {
        // On error, update the error log.
        dispatch(registerError(error));
        dispatch(clearAsync());
      });
    }
  }
}


/**
 * Kick off a search by sending parameters to the REST API.
 * 
 * @param {Object} source Source text metadata.
 * @param {Object} target Target text metadata.
 * @param {Object} params Advanced options for the search.
 * @param {String[]} stopwords List of tokens to exclude from the search.
 * @param {boolean} pending True if any AJAX calls are in progress.
 * @returns {function} Callback that calls dispatch to handle communication.
 */
export function initiateSearch(source, target, params, stopwords, pending) {
  return dispatch => {
    // Only kick off a request to the REST API if no other requests are active.
    if (!pending) {
      // Update app state to show there is a new async action.
      dispatch(updateSearchID());
      dispatch(updateResults());
      dispatch(initiateAsync());

      // Start a request to the parallels endpoint of the REST API.
      // This creates a Promise that resolves when a reqponse or error is received.
      axios({
          method: 'post',
          url: `${REST_API}/parallels/`,
          crossDomain: true,
          headers: {
            contentType: 'x-www-form-urlencoded'
          },
          responseType: 'json',
          cacheControl: 'no-store',
          data : {
            source: {
              object_id: source.object_id,
              units: params.unitType
            },
            target: {
              object_id: target.object_id,
              units: params.unitType
            },
            method: {
              name: 'original',
              feature: params.feature,
              stopwords: stopwords,
              freq_basis: params.frequencyBasis,
              max_distance: parseInt(params.maxDistance, 10),
              distance_basis: params.distanceBasis
            }
          }
      })
      .then(response => {
        // On success, update the global state and return the search ID or results.
        dispatch(clearAsync());
        
        let searchID = '';

        if (response.headers.location !== undefined) {
          searchID = response.headers.location.split('/').slice(-2)[0];
          dispatch(updateSearchID(searchID));
        }

        if (response.data.parallels !== undefined) {
          const normedParallels = normalizeScores(response.data.parallels);
          dispatch(updateResults(normedParallels));
        }
        
        return searchID;
      })
      .catch(error => {
        // On error, update the error log.
        dispatch(clearAsync());
        dispatch(registerError(error));
      });
    }
  }
}


/**
 * Ping the REST API to get the status of a search.
 * 
 * @param {String} searchID The ID of the search obained when it was initiated.
 * @param {boolean} pending True if any AJAX calls are in progress.
 * @returns {function} Callback that calls dispatch to handle communication.
 */
export function getSearchStatus(searchID, pending) {
  return dispatch => {
    // Only kick off a request to the REST API if no other requests are active.
    if (!pending) {
      // Update app state to show there is a new async action.
      dispatch(initiateAsync());

      // Start a request to the parallels endpoint of the REST API.
      // This creates a Promise that resolves when a reqponse or error is received.
      axios({
        method: 'get',
        url: `${REST_API}/parallels/${searchID}/status/`,
        crossDomain: true,
        responseType: 'json',
        cacheControl: 'no-store'
      })
      .then(response => {
        // On success, update the global state and return the status.
        dispatch(clearAsync());
        dispatch(updateSearchStatus(response.data.status, response.data.progress));
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
 * @param {boolean} pending True if any AJAX calls are in progress.
 * @returns {function} Callback that calls dispatch to handle communication.
 */
export function fetchResults(searchID, pending) {
  return dispatch => {
    // Only kick off a request to the REST API if no other requests are active.
    if (!pending) {
      // Update app state to show there is a new async action.
      dispatch(initiateAsync());

      // Start a request to the parallels endpoint of the REST API.
      // This creates a Promise that resolves when a reqponse or error is received.
      axios({
          method: 'get',
          url: `${REST_API}/parallels/${searchID}`,
          crossDomain: true,
          responseType: 'json',
          cacheControl: 'no-store'
      })
      .then(response => {
        // On success, update the global state and return the results.
        // Because of strange design constraints and group consensus, normalize
        // all scores to be in range [0, 10].
        const normedParallels = normalizeScores(response.data.parallels);
        dispatch(clearAsync());
        dispatch(updateResults(normedParallels, normedParallels.length));
        return normedParallels;
      })
      .catch(error => {
        // On error, update the error log.
        dispatch(clearAsync());
        dispatch(registerError(error));
      });
    }
  }
}