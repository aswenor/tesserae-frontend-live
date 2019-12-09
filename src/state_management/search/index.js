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
  matchSet: null,
  searchParameters: {
    language: 'latin',
    texts: [
      {}, // source
      {}  // target
    ],
    unitType: 'phrase',
    feature: 'lemma',
    stoplist: 10,
    stoplistBasis: 'corpus',
    scoreBasis: 'word',
    frequencyBasis: 'corpus',
    maxDistance: 10,
    distanceMetric: 'frequency',
    dropScoresBelow: 6
  },
  results: [],
  resultCount: 0,
  currentPage: 0,
  resultsPerPage: 100,
  loadResults: false
};


/**
 * Lookup table for state update functions.
 */
const ACTIONS = {
  UPDATESEARCHPARAMETERS: updateSearchParametersReducer,
  CHANGEPAGE: changePageReducer,
  CHANGERESULTSPERPAGE: changeResultsPerPageReducer,
  UPDATECURRENTRESULTS: updateCurrentResultsReducer
};


/**
 * Update the current Tesserae REST API search parameters.
 *
 * @param {Object} newParameters - New search parameters.
 * @returns
 */
export const updateSearchParameters = (newParameters = DEFAULTS.searchParameters) => ({
  type: 'UPDATESEARCHPARAMETERS',
  payload: { ...newParameters }
});


/**
 *
 */
const changePage = (newPage = DEFAULTS.currentPage) => ({
  type: 'CHANGEPAGE',
  payload: { newPage }
});


const changeResultsPerPage = (resultsPerPage = DEFAULTS.resultsPerPage) => ({
  type: 'CHANGERESULTSPERPAGE',
  payload: { resultsPerPage }
});


const updateCurrentResults = (newResults = DEFAULTS.results) => ({
  type: 'UPDATECURRENTRESULTS',
  payload: { newResults }
});


/**
 * Update the application state of a Tesserae search.
 *
 * @param {Object} state - current application state
 * @param {Object} action - the type of update to performa and associated data.
 */
export function searchReducer(state = DEFAULTS, action) {
  const updater = ACTIONS[action.type];
  const outState = updater !== undefined ? updater(state, action.payload) : state;
  return outState;
}


/**
 * Update parameters governing a Tesserae search.
 *
 * @param {Object} state - Application state with search metadata.
 * @param {Object} payload -
 */
function updateSearchParametersReducer(state, payload) {
  const newState = {
    ...state,
    search_parameters: {
      ...state.search_parameters,
      ...payload.newParameters
    },
    loadResults: true
  };
  return newState;
}


function changePageReducer(state, payload) {
  const maxPage = Math.floor(state.result_count / state.results_per_page);
  let newPage = Math.min(Math.max(payload.newPage, 0), maxPage);

  if (newPage !== state.currentPage) {
    const newState = {
      ...state,
      currentPage: newPage,
      results: [],
      loadResults: true
    };

    return newState;
  }
  else {
    return state
  }
}


function changeResultsPerPageReducer(state, payload) {
  const newState = {
    ...state,
    resultsPerPage: payload.resultsPerPage,
    loadResults: true
  }
  return changePageReducer(newState, {newPage: 0});
}


function updateCurrentResultsReducer(state, payload) {
  const newState = {
    ...state,
    results: [ ...payload.newResults ],
    loadResults: false
  };
  return newState;
}
