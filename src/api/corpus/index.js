/**
 * @fileoverview Interactions with the REST API and updates to application state.
 * 
 * Note: All functions are named "Action" to denote that they conform to redux
 * actions. In this case they return callbacks that call the redux dispatch
 * function to update state, allowing easy mapping to React component props.
 * This setup also enables async actions that talk to the Tesserae REST API.
 * 
 * @author Jeff Kinnison <jkinniso@nd.edu>
 * 
 * @exports fetchLanguagesAction
 * @exports updateLanguageAction
 * @exports fetchTextsAction
 * @exports updateSourceTextAction
 * @exports updateTargetTextAction
 * @exports updateSearchParametersAction
 * @exports fetchStoplistAction
 * @exports initiateSearchAction
 * @exports getSearchStatusAction
 * @exports fetchResultsAction
 * @exports updateCurrentPageAction
 * @exports updateResultsPerPageAction
 * 
 * @requires NPM:axios
 * @requires ../../state_management/search
 */
import axios from 'axios';

import * as actions from '../../state_management/search';


/**
 * URL of the REST API as defined in the environment.
 */
const REST_API = process.env.REACT_APP_REST_API_URL;


/**
 * Fetch available languages from the REST API.
 * 
 * @param {boolean} pending True if any AJAX calls are in progress.
 * @returns {function} Callback that calls dispatch to handle communication.
 */
export function fetchLanguagesAction(pending) {
  return dispatch => {
    // Only kick off a request to the REST API if no other requests are active.
    if (!pending) {
      // Update app state to show there is a new async action.
      dispatch(actions.fetchLanguagesPending);
      
      // Start a request to the languages endpoint of the REST API.
      // This creates a Promise that resolves when a reqponse or error is received.
      axios({
        method: 'get',
        url: `${REST_API}/languages`,
        crossDomain: true,
        responseType: 'json',
      })
      .then(response => {
        // On success, update the global state and return the languages.
        dispatch(actions.fetchLanguagesSuccess(response.data.languages));
        return response.data.languages;
      })
      .catch(error => {
        // On error, update the error log.
        dispatch(actions.fetchLanguagesError(error));
      });
    }
  }
}


/**
 * Update the selected language of the app.
 * 
 * @param {String} language The language to change to.
 * @returns {function} Callback that calls dispatch to update state.
 */
export function updateLanguageAction(language) {
  return dispatch => {
      dispatch(actions.updateLanguage(language));
  }
}


/**
 * Fetch available texts of the selected language from the REST API.
 * 
 * @param {String} language The language of texts to fetch.
 * @param {boolean} shouldFetch True if a language was selected and no AJAX calls are in progress.
 * @returns {function} Callback that calls dispatch to handle communication.
 */
export function fetchTextsAction(language, shouldFetch) {
  return dispatch => {
    // Only kick off a request to the REST API if no other requests are active.
    if (shouldFetch) {
      // Update app state to show there is a new async action.
      dispatch(actions.fetchTextsPending());

      // Start a request to the texts endpoint of the REST API.
      // This creates a Promise that resolves when a reqponse or error is received.
      axios({
        method: 'get',
        url: `${REST_API}/texts`,
        crossDomain: true,
        responseType: 'json',
        params: {
          language: language
        }
      })
      .then(response => {
        // On success, update the global state and return the text list.
        dispatch(actions.fetchTextsSuccess(response.data.texts));
        return response.data.texts;
      })
      .catch(error => {
        // On error, update the error log.
        dispatch(actions.fetchTextsError(error));
      });
    }
  }
}


/**
 * Update the selected source text being searched.
 * 
 * @param {Event} event The browser event fired by the calling component.
 * @param {Object} value The selected source text metadata.
 * @returns {function} Callback that calls dispatch to update state.
 */
export function updateSourceTextAction(event, value) {
  const realval = value.object_id !== undefined ? value : {author: '', title: ''};
  return dispatch => dispatch(actions.updateSourceText(realval));
}


/**
 * Update the selected target text being searched.
 * 
 * @param {Event} event The browser event fired by the calling component.
 * @param {Object} value The selected source text metadata.
 * @returns {function} Callback that calls dispatch to update state.
 */
export function updateTargetTextAction(event, value) {
  const realval = value.object_id !== undefined ? value : {author: '', title: ''};
  return dispatch => dispatch(actions.updateTargetText(realval));
}


/**
 * Update the search parameters.
 * 
 * @param {Object} params The advanced parameters of the search.
 * @returns {function} Callback that calls dispatch to update state.
 */
export function updateSearchParametersAction(params) {
  return dispatch => dispatch(actions.updateSearchParameters(params))
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
export function fetchStoplistAction(feature, stopwords, stoplistBasis, pending) {
  return dispatch => {
    // Only kick off a request to the REST API if no other requests are active.
    if (!pending) {
      // Update app state to show there is a new async action.
      dispatch(actions.fetchStoplistPending());

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
        dispatch(actions.fetchStoplistSuccess(response.data.stopwords))
        return response.data.stopwords
      })
      .catch(error => {
        // On error, update the error log.
        dispatch(actions.fetchStoplistError(error))
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
export function initiateSearchAction(source, target, params, stopwords, pending) {
  return dispatch => {
    // Only kick off a request to the REST API if no other requests are active.
    if (!pending) {
      // Update app state to show there is a new async action.
      dispatch(actions.initiateSearchPending());

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
        if (response.headers.location !== undefined) {
          const searchID = response.headers.location.split('/')[4];
          dispatch(actions.initiateSearchSuccess(searchID));
          return searchID;
        }

        if (response.data.parallels !== undefined) {
          dispatch(actions.fetchResultsSuccess(response.data.parallels));
        }
        
        return undefined;
      })
      .catch(error => {
        // On error, update the error log.
        dispatch(actions.initiateSearchError(error));
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
export function getSearchStatusAction(searchID, pending) {
  return dispatch => {
    // Only kick off a request to the REST API if no other requests are active.
    if (!pending) {
      // Update app state to show there is a new async action.
      dispatch(actions.getSearchStatusPending);

      // Start a request to the parallels endpoint of the REST API.
      // This creates a Promise that resolves when a reqponse or error is received.
      axios({
        method: 'get',
        url: `${REST_API}/parallels/${searchID}/status/`,
        crossDomain: true,
        responseType: 'json'
      })
      .then(response => {
        // On success, update the global state and return the status.
        const done = response.data.status === 'Done';
        dispatch(actions.getSearchStatusSuccess(response.data.status, done));
        return response.data.status;
      })
      .catch(error => {
        // On error, update the error log.
        dispatch(actions.getSearchStatusError(error));
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
export function fetchResultsAction(searchID, pending) {
  return dispatch => {
    // Only kick off a request to the REST API if no other requests are active.
    if (!pending) {
      // Update app state to show there is a new async action.
      dispatch(actions.fetchResultsPending());

      // Start a request to the parallels endpoint of the REST API.
      // This creates a Promise that resolves when a reqponse or error is received.
      axios({
          method: 'get',
          url: `${REST_API}/parallels/${searchID}`,
          crossDomain: true,
          responseType: 'json'
      })
      .then(response => {
        // On success, update the global state and return the results.
        dispatch(actions.fetchResultsSuccess(response.data.parallels));
        return response.data.parallels;
      })
      .catch(error => {
        // On error, update the error log.
        dispatch(actions.fetchResultsError(error));
      });
    }
  }
}


/**
 * Update the page of results being displayed.
 * 
 * @param {Event} event The browser event fired by the calling component.
 * @param {Object} value The selected page number.
 * @returns {function} Callback that calls dispatch to update state.
 */
export function updateCurrentPageAction(event, value) {
  return dispatch => dispatch(actions.updateCurrentPage());
}


/**
 * Update the number of results displayed per page.
 * 
 * @param {Event} event The browser event fired by the calling component.
 * @param {Object} value The number of results to display per page.
 * @returns {function} Callback that calls dispatch to update state.
 */
export function updateRowsPerPageAction(event, value) {
  return dispatch => dispatch(actions.updateRowsPerPage());
}
