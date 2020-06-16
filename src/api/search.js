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
         registerError } from '../state_management/async';
import { updateResults, updateSearchID,
         updateSearchParameters, updateSearchStatus,
         updateSourceText, updateStopwords,
         updateTargetText } from '../state_management/search';


/**
 * URL of the REST API as defined in the environment.
 */
const REST_API = process.env.REACT_APP_REST_API_URL;


/**
 * Update the selected source text being searched.
 * 
 * @param {Event} event The browser event fired by the calling component.
 * @param {Object} value The selected source text metadata.
 * @returns {function} Callback that calls dispatch to update state.
 */
export function updateSourceText(event, value) {
  const realval = value && value.object_id !== undefined ? value : {author: '', title: ''};
  return dispatch => dispatch(updateSourceText(realval));
}


/**
 * Update the selected target text being searched.
 * 
 * @param {Event} event The browser event fired by the calling component.
 * @param {Object} value The selected source text metadata.
 * @returns {function} Callback that calls dispatch to update state.
 */
export function updateTargetText(event, value) {
  // If an incorrect text object, dispatch a blank text.
  const realval = value && value.object_id !== undefined ? value : {author: '', title: ''};
  return dispatch => dispatch(updateTargetText(realval));
}


/**
 * Update the search parameters.
 * 
 * @param {Object} params The advanced parameters of the search.
 * @returns {function} Callback that calls dispatch to update state.
 */
export function updateSearchParameters(params) {
  return dispatch => dispatch(updateSearchParameters(params));
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
        console.log(response.headers.location);
        if (response.headers.location !== undefined) {
          const searchID = response.headers.location.split('/')[5];
          dispatch(updateSearchID(searchID));
          dispatch(clearAsync());
          return searchID;
        }

        if (response.data.parallels !== undefined) {
          let normedParallels = response.data.parallels;
          let maxScore = maxBy(normedParallels, item => item.score).score;
          
          if (maxScore > 10) {
            normedParallels = response.data.parallels.map(item => {
              const score = Math.round((item.score * 10) / maxScore);
              return {
                ...item,
                score: score
              };
            });
          }
          
          dispatch(updateResults(normedParallels));
          dispatch(clearAsync());
          return normedParallels;
        }
        
        return undefined;
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
        const done = response.data.status === 'Done';
        dispatch(updateSearchStatus(response.data.status, response.data.progress));
        if (done) {
          dispatch(clearAsync());
        }
        return response.data.status;
      })
      .catch(error => {
        // On error, update the error log.
        dispatch(registerError(error));
        dispatch(clearAsync());
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
        let normedParallels = response.data.parallels;
        let maxScore = maxBy(normedParallels, item => item.score);
        
        if (maxScore > 10) {
          normedParallels = response.data.parallels.map(item => {
            const score = Math.round((item.score * 10) / maxScore);
            return {
              ...item,
              score: score
            };
          });
        }
        
        dispatch(updateResults(normedParallels));
        dispatch(clearAsync());
        return normedParallels;
      })
      .catch(error => {
        // On error, update the error log.
        dispatch(registerError(error));
        dispatch(clearAsync());
      });
    }
  }
}