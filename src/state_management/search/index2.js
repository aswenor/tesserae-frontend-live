/**
 * Utilities for managing one or more active Tesserae searches.
 *
 * @module state_management/search
 * @author Jeff Kinnison <jkinniso@nd.edu>
 */


/**
 * Default state for Tesserae searches.
 */
const DEFAULTS = {
  searchID: null,
  language: 'latin',
  availableTexts: [],
  searchParameters: {
    texts: [
      {}, // source
      {}  // target
    ],
    unitType: 'phrase',
    feature: 'lemma',
    stoplist: '10',
    stoplistBasis: 'corpus',
    scoreBasis: 'word',
    frequencyBasis: 'corpus',
    maxDistance: '10 words',
    distanceMetric: 'frequency',
    dropScoresBelow: '6'
  },
  results: [],
  resultCount: 0,
  currentPage: 0,
  resultsPerPage: 100,
  fetchTextsPending: false,
  initiateSearchPending: false,
  fetchResultsPending: false,
  fetchTextsError: null,
  initiateSearchError: null,
  fetchResultsError: null
};


/**
 * Action types and their associted actions.
 */
const ACTIONS = {
  FETCH_TEXTS_PENDING: fetchTextsPending,
  FETCH_TEXT_SUCCESS: fetchTextsSuccess,
  FETCH_TEXTS_ERROR: fetchTextsError,
  UPDATE_SEARCH_PARAMETERS: updateSearchParameters,
  INITIATE_SEARCH_PENDING: initiateSearchPending,
  INITIATE_SEARCH_SUCCESS: initiateSearchSuccess,
  INITIATE_SEARCH_ERROR: initiateSearchError,
  FETCH_RESULTS_PENDING: fetchResultsPending,
  FETCH_RESULTS_SUCCESS: fetchResultsSuccess,
  FETCH_RESULTS_ERROR: fetchResultsError
};


/**
 *  Action creators for a common interface into the state store.
 **/

/**
 *  Create an action to fetch available texts from the REST API.
 *
 * @param {String} language - language to filter the text list by
 * @returns {Object} A redux-style action.
 **/
export function fetchTextsPending(language = DEFAULTS.language) {
  return {
    type: 'FETCH_TEXTS_PENDING',
    payload: {
      language: language,
      fetchTextsPending: true
    }
  };
}


/**
 *  Create an action to save texts fetched from the REST API.
 *
 * @param {Array} availableTexts - list of texts to make available for search
 * @returns {Object} A redux-style action.
 **/
export function fetchTextsSuccess(availableTexts) {
  return {
    type: 'FETCH_TEXTS_SUCCESS',
    payload: {
      availableTexts: availableTexts,
      fetchTextsPending: false
    }
  };
}


/**
 *  Create an action to report an error fetching texts from the REST API.
 *
 * @param {Object} error - error log returned from the request
 * @returns {Object} A redux-style action.
 **/
export function fetchTextsError(error) {
  return {
    type: 'FETCH_TEXTS_ERROR',
    payload: {
      fetchTextsError: error,
      fetchTextsPending: false
    }
  };
}


/**
 *  Create an action to initiate a search through the REST API.
 *
 * @returns {Object} A redux-style action.
 **/
export function initiateSearchPending() {
  return {
    type: 'INITIATE_SEARCH_PENDING',
    payload: {
      initiateSearchPending: true
    }
  };
}


/**
 *  Create an action to save etched from the REST API.
 *
 * @param {String} searchID - reference ID to look up search status/results
 * @returns {Object} A redux-style action.
 **/
export function initiateSearchSuccess(searchID) {
  return {
    type: 'INITIATE_SEARCH_SUCCESS',
    payload: {
      searchID: searchID,
      initiateSearchPending: false
    }
  };
}


/**
 *  Create an action to report an error starting a search through the REST API.
 *
 * @param {Object} error - error log returned from the request
 * @returns {Object} A redux-style action.
 **/
export function initiateSearchError(error) {
  return {
    type: 'INITIATE_SEARCH_ERROR',
    payload: {
      initiateSearchError: error,
      initiateSearchPending: false
    }
  };
}


/**
 *  Create an action to fetch search results from the REST API.
 *
 * @returns {Object} A redux-style action.
 **/
export function fetchResultsPending() {
  return {
    type: 'FETCH_RESULTS_PENDING',
    payload: {
      fetchResultsPending: true
    }
  };
}


/**
 *  Create an action to store results fetched from the REST API.
 *
 * @param {Array} results - list of intertext search results
 * @returns {Object} A redux-style action.
 **/
export function fetchResultsSuccess(results) {
  return {
    type: 'FETCH_RESULTS_SUCCESS',
    payload: {
      results: results,
      fetchResultsPending: false
    }
  };
}


/**
 *  Create an action to report an error fetching results from the REST API.
 *
 * @param {Object} error - error log returned from the request
 * @returns {Object} A redux-style action.
 **/
export function fetchResultsError(error) {
  return {
    type: 'FETCH_RESULTS_ERROR',
    payload: {
      fetchResultsError: error,
      fetchResultsPending: false
    }
  };
}
