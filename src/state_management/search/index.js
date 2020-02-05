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
  status: null,
  availableLanguages: [],
  language: 'latin',
  availableTexts: [],
  sourceText: {author: '', title: ''},
  targetText: {author: '', title: ''},
  stopwords: [],
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
  shouldFetchTexts: true,
  shouldFetchResults: false,
  disableSearch: false,
  asyncPending: false,
  fetchLanguagesError: null,
  fetchTextsError: null,
  fetchStoplistError: null,
  initiateSearchError: null,
  fetchResultsError: null
};


/**
 * Action types and their associted actions.
 */
const FETCH_LANGUAGES_PENDING = 'FETCH_LANGUAGES_PENDING';
const FETCH_LANGUAGES_SUCCESS = 'FETCH_LANGUAGES_SUCCESS';
const FETCH_LANGUAGES_ERROR = 'FETCH_LANGUAGES_ERROR';
const UPDATE_LANGUAGE = 'UPDATE_LANGUAGE';
const FETCH_TEXTS_PENDING = 'FETCH_TEXTS_PENDING';
const FETCH_TEXTS_SUCCESS = 'FETCH_TEXTS_SUCCESS';
const FETCH_TEXTS_ERROR = 'FETCH_TEXTS_ERROR';
const UPDATE_SOURCE_TEXT = 'UPDATE_SOURCE_TEXT';
const UPDATE_TARGET_TEXT = 'UPDATE_TARGET_TEXT';
const UPDATE_SEARCH_PARAMETERS = 'UPDATE_SEARCH_PARAMETERS';
const FETCH_STOPLIST_PENDING = 'FETCH_STOPLIST_PENDING';
const FETCH_STOPLIST_SUCCESS = 'FETCH_STOPLIST_SUCCESS';
const FETCH_STOPLIST_ERROR = 'FETCH_STOPLIST_ERROR';
const INITIATE_SEARCH_PENDING = 'INITIATE_SEARCH_PENDING';
const INITIATE_SEARCH_SUCCESS = 'INITIATE_SEARCH_SUCCESS';
const INITIATE_SEARCH_ERROR = 'INITIATE_SEARCH_ERROR';
const FETCH_RESULTS_PENDING = 'FETCH_RESULTS_PENDING';
const FETCH_RESULTS_SUCCESS = 'FETCH_RESULTS_SUCCESS';
const FETCH_RESULTS_ERROR = 'FETCH_RESULTS_ERROR';
const UPDATE_RESULTS_TABLE = 'UPDATE_RESULTS_TABLE';


/**
 *  Action creators for a common interface into the state store.
 **/


/**
 *  Create an action to fetch available languages from the REST API.
 *
 * @returns {Object} A redux-style action.
 **/
export function fetchLanguagesPending() {
  return {
    type: FETCH_LANGUAGES_PENDING
  };
}


/**
 *  Create an action to save languages fetched from the REST API.
 *
 * @param {Array} availableLanguages - list of languages to make available for search
 * @returns {Object} A redux-style action.
 **/
export function fetchLanguagesSuccess(availableLanguages) {
  return {
    type: FETCH_LANGUAGES_SUCCESS,
    payload: {
      availableLanguages: availableLanguages
    }
  };
}


/**
 *  Create an action to report an error fetching languages from the REST API.
 *
 * @param {Object} error - error log returned from the request
 * @returns {Object} A redux-style action.
 **/
export function fetchLanguagesError(error = {}) {
  return {
    type: FETCH_LANGUAGES_ERROR,
    payload: {
      fetchLanguagesError: error
    }
  };
}


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
      availableTexts: [],
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
    type: FETCH_TEXTS_PENDING
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
      fetchTextsError: error
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
 *  Create an action to fetch a stoplist from the REST API.
 *
 * @returns {Object} A redux-style action.
 **/
export function fetchStoplistPending() {
  return {
    type: FETCH_STOPLIST_PENDING
  };
}


/**
 *  Create an action to save a stoplist fetched from the REST API.
 *
 * @param {Array} stoplist - list of words to ignore in a search
 * @returns {Object} A redux-style action.
 **/
export function fetchStoplistSuccess(stopwords) {
  return {
    type: FETCH_STOPLIST_SUCCESS,
    payload: {
      stopwords: stopwords,
    }
  };
}


/**
 *  Create an action to report an error fetching a stoplist from the REST API.
 *
 * @param {Object} error - error log returned from the request
 * @returns {Object} A redux-style action.
 **/
export function fetchStoplistError(error = {}) {
  return {
    type: FETCH_STOPLIST_ERROR,
    payload: {
      fetchTextsError: error
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
    type: INITIATE_SEARCH_PENDING
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
      searchID: searchID
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
      initiateSearchError: error
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
    type: FETCH_RESULTS_PENDING
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
      results: results
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
      fetchResultsError: error
    }
  };
}


/**
 *  Create an action to update the parameters of the search results table.
 *
 * @param {Number} currentPage - the page of results to show
 * @param {Number} resultsPerPage - the number of rows to display on a page
 * @returns {Object} A redux-style action.
 **/
export function updateResultsTable(currentPage = DEFAULT_STATE.currentPage, resultsPerPage = DEFAULT_STATE.resultsPerPage) {
  return {
    type: UPDATE_RESULTS_TABLE,
    payload: {
      currentPage: currentPage,
      resultsPerPage: resultsPerPage
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
  const disableSearch = (
    !state.sourceText.object_id &&
    !state.targetText.object_id &&
    state.stopwords.length === 0);
  //let shouldFetchStoplist = false;
  switch (action.type) {
    case FETCH_LANGUAGES_PENDING:
      return {
        ...state,
        asyncPending: true,
        disableSearch: disableSearch,
      };
    case FETCH_LANGUAGES_SUCCESS:
      return {
        ...state,
        availableLanguages: action.payload.availableLanguages,
        asyncPending: false,
        disableSearch: disableSearch,
      };
    case FETCH_LANGUAGES_ERROR:
      return {
        ...state,
        disableSearch: disableSearch,
        fetchLanguagesError: action.payload.error,
        asyncPending: false
      };
    case UPDATE_LANGUAGE:
      let shouldFetchStoplist = state.searchParameters.stoplistBasis === 'corpus';
      return {
        ...state,
        availableTexts: action.payload.availableTexts,
        disableSearch: disableSearch,
        language: action.payload.language,
        shouldFetchStoplist: shouldFetchStoplist,
        shouldFetchTexts: true,
      };
    case FETCH_TEXTS_PENDING:
      return {
        ...state,
        asyncPending: true,
        disableSearch: disableSearch,
        shouldFetchTexts: false,
      };
    case FETCH_TEXTS_SUCCESS:
      return {
        ...state,
        availableTexts: action.payload.availableTexts,
        asyncPending: false,
        disableSearch: disableSearch,
        shouldFetchTexts: false,
      };
    case FETCH_TEXTS_ERROR:
      return {
        ...state,
        fetchTextsError: action.payload.error,
        asyncPending: false,
        disableSearch: disableSearch,
        shouldFetchTexts: true,
      };
    case UPDATE_SOURCE_TEXT:
      shouldFetchStoplist = (
        state.sourceText.object_id
        && state.targetText.object_id);
      console.log(shouldFetchStoplist);
      return {
        ...state,
        disableSearch: disableSearch,
        shouldFetchStoplist: shouldFetchStoplist,
        sourceText: action.payload.sourceText
      };
    case UPDATE_TARGET_TEXT:

      shouldFetchStoplist = (
          state.sourceText.object_id
          && state.targetText.object_id);
      return {
        ...state,
        disableSearch: disableSearch,
        targetText: action.payload.targetText
      };
    case UPDATE_SEARCH_PARAMETERS:
      shouldFetchStoplist = (
        state.sourceText.object_id
        && state.targetText.object_id
        && action.payload.stoplist
        && action.payload.stoplistBasis);
      return {
        ...state,
        disableSearch: disableSearch,
        searchParameters: {
          ...state.searchParameters,
          ...action.payload
        }
      };
      case FETCH_STOPLIST_PENDING:
        return {
          ...state,
          asyncPending: true,
          disableSearch: disableSearch,
        };
      case FETCH_STOPLIST_SUCCESS:
        return {
          ...state,
          disableSearch: disableSearch,
          stopwords: action.payload.availableTexts,
          asyncPending: false
        };
      case FETCH_STOPLIST_ERROR:
        return {
          ...state,
          disableSearch: disableSearch,
          fetchStoplistError: action.payload.error,
          asyncPending: false
        };
    case INITIATE_SEARCH_PENDING:
      return {
        ...state,
        asyncPending: true,
        disableSearch: disableSearch,
      };
    case INITIATE_SEARCH_SUCCESS:
      return {
        ...state,
        disableSearch: disableSearch,
        searchID: action.payload.searchID,
        asyncPending: false
      };
    case INITIATE_SEARCH_ERROR:
      return {
        ...state,
        disableSearch: disableSearch,
        initiateSearchError: action.payload.error,
        asyncPending: false
      };
    case FETCH_RESULTS_PENDING:
      return {
        ...state,
        asyncPending: true,
        disableSearch: disableSearch,
      };
    case FETCH_RESULTS_SUCCESS:
      return {
        ...state,
        disableSearch: disableSearch,
        results: action.payload.results,
        asyncPending: false
      };
    case FETCH_RESULTS_ERROR:
      return {
        ...state,
        disableSearch: disableSearch,
        fetchResultsError: action.payload.error,
        asyncPending: false
      };
    case UPDATE_RESULTS_TABLE:
      return {
        ...state,
        currentPage: action.payload.currentPage,
        disableSearch: disableSearch,
        resultsPerPage: action.payload.resultsPerPage,
        shouldFetchResults: true
      }
    default:
      return state;
  }
}
