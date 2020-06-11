/**
 * @fileoverview Redux utilities for managing Tesserae search internal state.
 * 
 * Note: This file is long but mostly boilerplate standardizing interactions
 * with the redux store. There are some fancier ways of handling redux actions
 * and reducers, however they do not work well with the way this data is
 * structured.
 *
 * @author Jeff Kinnison <jkinniso@nd.edu>
 * 
 * @exports DEFAULT_STATE
 * @exports fetchLanguagesPending
 * @exports fetchLanguagesSuccess
 * @exports fetchLanguagesError
 * @exports updateLanguage
 * @exports fetchTextsPending
 * @exports fetchTextsSuccess
 * @exports fetchTextsError
 * @exports updateSourceText
 * @exports updateTargetText
 * @exports updateSearchParameters
 * @exports fetchStoplistPending
 * @exports fetchStoplistSuccess
 * @exports fetchStoplistError
 * @exports initiateSearchPending
 * @exports initiateSearchSuccess
 * @exports initiateSearchError
 * @exports getSearchStatusPending
 * @exports getSearchStatusSuccess
 * @exports getSearchStatusError
 * @exports fetchResultsPending
 * @exports fetchResultsSuccess
 * @exports fetchResultsError
 * @exports updateCurrentPage
 * @exports updateRowsPerPage
 * @exports searchReducer
 */


/**
 * Default state for Tesserae searches.
 */
export const DEFAULT_STATE = {
  searchID: null,
  status: '',
  availableLanguages: [],
  language: '',
  availableTexts: [],
  sourceText: {author: '', title: ''},
  targetText: {author: '', title: ''},
  stopwords: [],
  searchParameters: {
    unitType: 'phrase',
    feature: 'lemmata',
    stoplist: '10',
    stoplistBasis: 'corpus',
    scoreBasis: 'word',
    frequencyBasis: 'corpus',
    maxDistance: '10 words',
    distanceBasis: 'frequency',
    dropScoresBelow: '6'
  },
  results: [],
  resultCount: 0,
  currentPage: 0,
  rowsPerPage: 100,
  shouldFetchTexts: true,
  shouldInitiateSearch: false,
  shouldFetchResults: false,
  disableSearch: true,
  asyncPending: false,
  searchInProgress: false,
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
const GET_SEARCH_STATUS_PENDING = 'GET_SEARCH_STATUS_PENDING';
const GET_SEARCH_STATUS_SUCCESS = 'GET_SEARCH_STATUS_SUCCESS';
const GET_SEARCH_STATUS_ERROR = 'GET_SEARCH_STATUS_ERROR';
const FETCH_RESULTS_PENDING = 'FETCH_RESULTS_PENDING';
const FETCH_RESULTS_SUCCESS = 'FETCH_RESULTS_SUCCESS';
const FETCH_RESULTS_ERROR = 'FETCH_RESULTS_ERROR';
const UPDATE_CURRENT_PAGE = 'UPDATE_CURRENT_PAGE';
const UPDATE_ROWS_PER_PAGE = 'UPDATE_ROWS_PER_PAGE';


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
    type: FETCH_LANGUAGES_PENDING,
    payload: {
      asyncPending: true
    }
  };
}


/**
 *  Create an action to save languages fetched from the REST API.
 *
 * @param {Array} availableLanguages - list of languages to make available for search
 * @param {String} language - the language to select from the list
 * @returns {Object} A redux-style action.
 **/
export function fetchLanguagesSuccess(availableLanguages = DEFAULT_STATE.availableLanguages,
                                      language = DEFAULT_STATE.language) {
  return {
    type: FETCH_LANGUAGES_SUCCESS,
    payload: {
      asyncPending: false,
      availableLanguages: availableLanguages,
      language: language,
      shouldFetchTexts: true,
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
      asyncPending: false,
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
      searchID: DEFAULT_STATE.searchID,
      status: DEFAULT_STATE.status,
      language: language,
      availableTexts: DEFAULT_STATE.availableTexts,
      sourceText: {...DEFAULT_STATE.sourceText},
      targetText: {...DEFAULT_STATE.targetText},
      stopwords: [...DEFAULT_STATE.stopwords],
      searchParameters: {...DEFAULT_STATE.searchParameters},
      results: [...DEFAULT_STATE.results],
      resultCount: DEFAULT_STATE.resultCount,
      currentPage: DEFAULT_STATE.currentPage,
      rowsPerPage: DEFAULT_STATE.rowsPerPage,
      shouldFetchTexts: true,
      shouldInitiateSearch: DEFAULT_STATE.shouldInitiateSearch,
      shouldFetchResults: DEFAULT_STATE.shouldFetchResults,
      disableSearch: DEFAULT_STATE.disableSearch,
      asyncPending: DEFAULT_STATE.asyncPending,
      searchInProgress: DEFAULT_STATE.searchInProgress,
      fetchLanguagesError: DEFAULT_STATE.fetchLanguagesError,
      fetchTextsError: DEFAULT_STATE.fetchTextsError,
      fetchStoplistError: DEFAULT_STATE.fetchStoplistError,
      initiateSearchError: DEFAULT_STATE.initiateSearchError,
      fetchResultsError: DEFAULT_STATE.fetchResultsError,
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
      asyncPending: true
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
      asyncPending: false,
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
      asyncPending: false,
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
export function updateSourceText(sourceText) {
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
export function updateTargetText(targetText = DEFAULT_STATE.targetText) {
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
    type: FETCH_STOPLIST_PENDING,
    payload: {
      asyncPending: true
    }
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
      asyncPending: false,
      shouldInitiateSearch: true,
      stopwords: stopwords
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
      asyncPending: false,
      fetchTextsError: error,
      shouldInitiateSearch: false
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
      asyncPending: true,
      shouldInitiateSearch: false,
      searchInProgress: true,
      results: DEFAULT_STATE.results,
      resultCount: DEFAULT_STATE.resultCount,
      currentPage: DEFAULT_STATE.currentPage
    }
  };
}


/**
 *  Create an action to save etched from the REST API.
 *
 * @param {String} searchID - reference ID to look up search status/results
 * @returns {Object} A redux-style action.
 **/
export function initiateSearchSuccess(searchID = DEFAULT_STATE.searchID) {
  return {
    type: INITIATE_SEARCH_SUCCESS,
    payload: {
      asyncPending: false,
      searchID: searchID,
      shouldFetchResults: true,
      shouldInitiateSearch: false
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
      asyncPending: false,
      initiateSearchError: error,
      shouldInitiateSearch: false
    }
  };
}


/**
 *  Create an action to get the status of a search from the REST API.
 *
 * @returns {Object} A redux-style action.
 **/
export function getSearchStatusPending() {
  return {
    type: GET_SEARCH_STATUS_PENDING,
    payload: {
      asyncPending: true,
      shouldInitiateSearch: false
    }
  };
}


/**
 *  Create an action to handle search status retrieved from the REST API.
 *
 * @param {String} status - The status returned from the server.
 * @param {Bool} shouldFetchResults - whether or not to fetch results.
 * @returns {Object} A redux-style action.
 **/
export function getSearchStatusSuccess(status = DEFAULT_STATE.status, shouldFetchResults = DEFAULT_STATE.shouldFetchResults) {
  return {
    type: GET_SEARCH_STATUS_SUCCESS,
    payload: {
      asyncPending: false,
      shouldFetchResults: shouldFetchResults,
      status: status
    }
  };
}


/**
 *  Create an action to report an error fetching results from the REST API.
 *
 * @param {Object} error - error log returned from the request
 * @returns {Object} A redux-style action.
 **/
export function getSearchStatusError(error = {}) {
  return {
    type: GET_SEARCH_STATUS_ERROR,
    payload: {
      asyncPending: false,
      fetchResultsError: error,
      shouldFetchResults: false
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
      asyncPending: true,
      shouldFetchResults: false
    }
  };
}


/**
 *  Create an action to store results fetched from the REST API.
 *
 * @param {Array} results - list of intertext search results
 * @returns {Object} A redux-style action.
 **/
export function fetchResultsSuccess(results = DEFAULT_STATE.results) {
  return {
    type: FETCH_RESULTS_SUCCESS,
    payload: {
      asyncPending: false,
      results: results,
      searchInProgress: false,
      shouldFetchResults: false,
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
      asyncPending: false,
      fetchResultsError: error,
      searchInProgress: false,
      shouldFetchResults: false,
    }
  };
}


/**
 *  Create an action to update the displayed page of the results table.
 *
 * @param {Number} currentPage - the page of results to show
 * @returns {Object} A redux-style action.
 **/
export function updateCurrentPage(currentPage = DEFAULT_STATE.currentPage) {
  return {
    type: UPDATE_CURRENT_PAGE,
    payload: {
      currentPage: currentPage
    }
  };
}


/**
 *  Create an action to update the number of results displayed per page of the results table;.
 * @param {Number} resultsPerPage - the number of rows to display on a page
 * @returns {Object} A redux-style action.
 **/
export function updateRowsPerPage(rowsPerPage = DEFAULT_STATE.rowsPerPage) {
  return {
    type: UPDATE_ROWS_PER_PAGE,
    payload: {
      rowsPerPage: rowsPerPage
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
  /**
   * Enable/disable the search button in response to the current state.
   */
  const disableSearch = (
    !state.sourceText.object_id &&
    !state.targetText.object_id &&
    state.stopwords.length === 0);

  switch (action.type) {
    case FETCH_LANGUAGES_PENDING:
      return {
        ...state,
        asyncPending: action.payload.asyncPending,
        disableSearch: disableSearch,
      };
    case FETCH_LANGUAGES_SUCCESS:
      return {
        ...state,
        availableLanguages: action.payload.availableLanguages,
        asyncPending: action.payload.asyncPending,
        disableSearch: disableSearch,
        language: action.payload.language,
        shouldFetchTexts: action.payload.shouldFetchTexts
      };
    case FETCH_LANGUAGES_ERROR:
      return {
        ...state,
        asyncPending: action.payload.asyncPending,
        disableSearch: disableSearch,
        fetchLanguagesError: action.payload.error,
      };
    case UPDATE_LANGUAGE:
      return {
        ...state,
        ...action.payload,
        searchParameters: {
          ...state.searchParameters,
          ...action.payload.searchParameters
        },
        language: action.payload.language,
        disableSearch: disableSearch,
        shouldFetchTexts: action.payload.shouldFetchTexts,
      };
    case FETCH_TEXTS_PENDING:
      return {
        ...state,
        asyncPending: action.payload.asyncPending,
        disableSearch: disableSearch,
        shouldFetchTexts: action.payload.shouldFetchTexts,
      };
    case FETCH_TEXTS_SUCCESS:
      return {
        ...state,
        asyncPending: action.payload.asyncPending,
        availableTexts: action.payload.availableTexts,
        disableSearch: disableSearch,
        shouldFetchTexts: action.payload.shouldFetchTexts,
      };
    case FETCH_TEXTS_ERROR:
      return {
        ...state,
        asyncPending: action.payload.asyncPending,
        disableSearch: disableSearch,
        fetchTextsError: action.payload.error,
        shouldFetchTexts: action.payload.shouldFetchTexts,
      };
    case UPDATE_SOURCE_TEXT:
      return {
        ...state,
        disableSearch: disableSearch,
        sourceText: action.payload.sourceText
      };
    case UPDATE_TARGET_TEXT:
      return {
        ...state,
        disableSearch: disableSearch,
        targetText: action.payload.targetText
      };
    case UPDATE_SEARCH_PARAMETERS:
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
          asyncPending: action.payload.asyncPending,
          disableSearch: disableSearch,
        };
      case FETCH_STOPLIST_SUCCESS:
        return {
          ...state,
          asyncPending: action.payload.asyncPending,
          disableSearch: disableSearch,
          shouldInitiateSearch: action.payload.shouldInitiateSearch,
          stopwords: action.payload.stopwords,
        };
      case FETCH_STOPLIST_ERROR:
        return {
          ...state,
          asyncPending: action.payload.asyncPending,
          disableSearch: disableSearch,
          fetchStoplistError: action.payload.error,
          shouldInitiateSearch: action.payload.shouldInitiateSearch
        };
    case INITIATE_SEARCH_PENDING:
      return {
        ...state,
        asyncPending: action.payload.asyncPending,
        disableSearch: disableSearch,
        results: action.payload.results,
        resultCount: action.payload.resultCount,
        currentPage: action.payload.currentPage,
        searchInProgress: action.payload.searchInProgress,
        shouldInitiateSearch: action.payload.shouldInitiateSearch,
      };
    case INITIATE_SEARCH_SUCCESS:
      return {
        ...state,
        asyncPending: action.payload.asyncPending,
        disableSearch: disableSearch,
        searchID: action.payload.searchID,
        shouldInitiateSearch: action.payload.shouldInitiateSearch
      };
    case INITIATE_SEARCH_ERROR:
      return {
        ...state,
        asyncPending: action.payload.asyncPending,
        disableSearch: disableSearch,
        initiateSearchError: action.payload.error,
        shouldInitiateSearch: action.payload.shouldInitiateSearch
      };
    case GET_SEARCH_STATUS_PENDING:
      return {
        ...state,
        asyncPending: action.payload.asyncPending,
        disableSearch: disableSearch,
        shouldInitiateSearch: action.payload.shouldInitiateSearch
      };
    case GET_SEARCH_STATUS_SUCCESS:
      return {
        ...state,
        asyncPending: action.payload.asyncPending,
        disableSearch: disableSearch,
        status: action.payload.status,
        shouldFetchResults: action.payload.shouldFetchResults
      };
    case GET_SEARCH_STATUS_ERROR:
      return {
        ...state,
        asyncPending: action.payload.asyncPending,
        disableSearch: disableSearch,
        getSearchStatusError: action.payload.error,
      };
    case FETCH_RESULTS_PENDING:
      return {
        ...state,
        asyncPending: action.payload.asyncPending,
        disableSearch: disableSearch,
      };
    case FETCH_RESULTS_SUCCESS:
      return {
        ...state,
        asyncPending: action.payload.asyncPending,
        disableSearch: disableSearch,
        results: action.payload.results,
        searchInProgress: action.payload.searchInProgress,
        shouldFetchResults: action.payload.shouldFetchResults,
      };
    case FETCH_RESULTS_ERROR:
      return {
        ...state,
        asyncPending: action.payload.asyncPending,
        disableSearch: disableSearch,
        fetchResultsError: action.payload.error,
        searchInProgress: action.payload.searchInProgress,
        shouldFetchResults: action.payload.shouldFetchResults,
      };
    case UPDATE_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload.currentPage,
        disableSearch: disableSearch,
      };
    case UPDATE_ROWS_PER_PAGE:
      return {
        ...state,
        disableSearch: disableSearch,
        resultsPerPage: action.payload.resultsPerPage,
      };
    default:
      return state;
  }
}
