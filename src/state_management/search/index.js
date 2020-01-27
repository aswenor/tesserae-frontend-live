/**
 * Utilities for managing one or more active Tesserae searches.
 *
 * @module state_management/search
 * @author Jeff Kinnison <jkinniso@nd.edu>
 */


/**
 * Default state for Tesserae searches.
 */
export const DEFAULT_STATE = {
  searchID: null,
  language: 'latin',
  availableTexts: [],
  sourceText: {author: '', title: ''},
  targetText: {author: '', title: ''},
  searchParameters: {
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
const UPDATE_LANGUAGE = 'UPDATE_LANGUAGE';
const FETCH_TEXTS_PENDING = 'FETCH_TEXTS_PENDING';
const FETCH_TEXTS_SUCCESS = 'FETCH_TEXTS_SUCCESS';
const FETCH_TEXTS_ERROR = 'FETCH_TEXTS_ERROR';
const UPDATE_SOURCE_TEXT = 'UPDATE_SOURCE_TEXT';
const UPDATE_TARGET_TEXT = 'UPDATE_TARGET_TEXT';
const UPDATE_SEARCH_PARAMETERS = 'UPDATE_SEARCH_PARAMETERS';
const INITIATE_SEARCH_PENDING = 'INITIATE_SEARCH_PENDING';
const INITIATE_SEARCH_SUCCESS = 'INITIATE_SEARCH_SUCCESS';
const INITIATE_SEARCH_ERROR = 'INITIATE_SEARCH_ERROR';
const FETCH_RESULTS_PENDING = 'FETCH_RESULTS_PENDING';
const FETCH_RESULTS_SUCCESS = 'FETCH_RESULTS_SUCCESS';
const FETCH_RESULTS_ERROR = 'FETCH_RESULTS_ERROR';


/**
 *  Action creators for a common interface into the state store.
 **/


/**
*  Create an action to update the language being searched.
*
* @param {String} language - language to filter the text list by
* @returns {Object} A redux-style action.
**/
export function updateLanguage(language = DEFAULT_STATE.language) {
  return {
    type: UPDATE_LANGUAGE,
    payload: {
      language: language
    }
  };
}


/**
 *  Create an action to fetch available texts from the REST API.
 *
 * @returns {Object} A redux-style action.
 **/
export function fetchTextsPending() {
  return {
    type: FETCH_TEXTS_PENDING,
    payload: {
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
    type: FETCH_TEXTS_SUCCESS,
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
export function fetchTextsError(error = {}) {
  return {
    type: FETCH_TEXTS_ERROR,
    payload: {
      fetchTextsError: error,
      fetchTextsPending: false
    }
  };
}


/**
*  Create an action to update the source text being searched.
*
* @param {Object} sourceText - the new source text to search
* @returns {Object} A redux-style action.
**/
export function updateSourceText(sourceText = DEFAULT_STATE.sourceText) {
  return {
    type: UPDATE_SOURCE_TEXT,
    payload: {
      sourceText: sourceText
    }
  };
}


/**
*  Create an action to update the target text being searched.
*
* @param {Object} targetText - the new target text to search
* @returns {Object} A redux-style action.
**/
export function updateTargetText(targetText = DEFAULT_STATE.sourceText) {
  return {
    type: UPDATE_TARGET_TEXT,
    payload: {
      targetText: targetText
    }
  };
}


/**
*  Create an action to update additional parameters of a search.
*
* @param {Object} searchParameters - constraints/settings for the search
* @returns {Object} A redux-style action.
**/
export function updateSearchParameters(searchParameters = DEFAULT_STATE.searchParameters) {
  return {
    type: UPDATE_SEARCH_PARAMETERS,
    payload: {
      ...searchParameters
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
    type: INITIATE_SEARCH_PENDING,
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
export function initiateSearchSuccess(searchID = null) {
  return {
    type: INITIATE_SEARCH_SUCCESS,
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
export function initiateSearchError(error = {}) {
  return {
    type: INITIATE_SEARCH_ERROR,
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
    type: FETCH_RESULTS_PENDING,
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
export function fetchResultsSuccess(results = []) {
  return {
    type: FETCH_RESULTS_SUCCESS,
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
export function fetchResultsError(error = {}) {
  return {
    type: FETCH_RESULTS_ERROR,
    payload: {
      fetchResultsError: error,
      fetchResultsPending: false
    }
  };
}


/**
 * Reducer
 **/


/**
 * Update the application state.
 *
 * Application state must be updated without mutating the current state. This
 * function applies updates by unrolling the state object, then unrolling the
 * action update to create a deep copy.
 *
 * @param {Object} state - the current application state
 * @param {Object} action - a redux-style action object
 * @returns {Object} The object with updated state.
 **/
export function searchReducer(state = DEFAULT_STATE, action = {}) {
  switch (action.type) {
    case UPDATE_LANGUAGE:
      return {
        ...state,
        language: action.payload.language
      };
    case FETCH_TEXTS_PENDING:
      return {
        ...state,
        fetchTextsPending: true
      };
    case FETCH_TEXTS_SUCCESS:
      return {
        ...state,
        availableTexts: action.payload.availableTexts,
        fetchTextsPending: false
      };
    case FETCH_TEXTS_ERROR:
      return {
        ...state,
        fetchTextsError: action.payload.error,
        fetchTextsPending: false
      };
    case UPDATE_SOURCE_TEXT:
      return {
        ...state,
        sourceText: action.payload.sourceText
      };
    case UPDATE_SOURCE_TEXT:
      return {
        ...state,
        targetText: action.payload.targetText
      };
    case UPDATE_SEARCH_PARAMETERS:
      return {
        ...state,
        searchParameters: {
          ...state.searchParameters,
          ...action.payload
        }
      };
    case INITIATE_SEARCH_PENDING:
      return {
        ...state,
        initiateSearchPending: true
      };
    case INITIATE_SEARCH_SUCCESS:
      return {
        ...state,
        searchID: action.payload.searchID,
        initiateSearchPending: true
      };
    case INITIATE_SEARCH_ERROR:
      return {
        ...state,
        initiateSearchError: action.payload.error,
        initiateSearchPending: true
      };
    case FETCH_RESULTS_PENDING:
      return {
        ...state,
        fetchResultsPending: true,
      };
    case FETCH_RESULTS_SUCCESS:
      return {
        ...state,
        results: action.payload.results,
        fetchResultsPending: true
      };
    case FETCH_RESULTS_ERROR:
      return {
        ...state,
        fetchResultsError: action.payload.error,
        fetchResultsPending: true
      };
    default:
      return state;
  }
}
