/**
 * Redux utilities for managing multitext search parameters and results.
 * 
 * @author Jeff Kinnison <jkinniso@nd.edu>
 * 
 * @exports DEFAULT_STATE
 * @exports multitextReducer
 */
import { differenceBy, uniqBy } from 'lodash';


/**
 * Default state for async communications.
 */
export const DEFAULT_STATE = {
  maxScore: 10,
  message: '',
  progress: [],
  results: [],
  searchID: '',
  selectedTexts: [],
  status: '',
};


/**
 * Action identifiers to specify which update occurs.
 */

const ADD_TEXT = 'MULTITEXT_ADD_TEXT';
const ADD_TEXTS = 'MULTITEXT_ADD_TEXTS';
const CLEAR_RESULTS = 'MULTITEXT_CLEAR_RESULTS';
const CLEAR_SEARCH = 'MULTITEXT_CLEAR_SEARCH';
const CLEAR_SEARCH_METADATA = 'MULTITEXT_CLEAR_SEARCH_METADATA';
const CLEAR_TEXTS = 'MULTITEXT_CLEAR_TEXTS';
const REMOVE_TEXT = 'MULTITEXT_REMOVE_TEXT';
const REMOVE_TEXTS = 'MULTITEXT_REMOVE_TEXTS';
const UPDATE_RESULTS = 'MULTITEXT_UPDATE_RESULTS';
const UPDATE_SEARCHID = 'MULTITEXT_UPDATE_SEARCHID';
const UPDATE_STATUS = 'MULTITEXT_UPDATE_STATUS';


/**
 * Actions
 * 
 * These functions update the application state related to async communucations.
 */

/**
 * Add a text to the multitext selection.
 * 
 * @param {Object} text Valid text with object_id, author, and title.
 * @returns {Object} A redux-style action.
 */
export function addText(text) {
  return {
    type: ADD_TEXT,
    payload: {
      texts: [text]
    }
  };
}


/**
 * Add multiple texts to the multitext selection.
 * 
 * @param {Array} texts Valid texts with object_id, author, and title.
 * @returns {Object} A redux-style action.
 */
export function addTexts(texts) {
  return {
    type: ADD_TEXTS,
    payload: {
      texts: texts
    }
  };
}


/**
 * Remove multitext search results.
 * 
 * @returns {Object} A redux-style action.
 */
export function clearResults() {
  return {
    type: CLEAR_RESULTS
  }
}


/**
 * Clear all search data.
 * 
 * @returns {Object} A redux-style action.
 */
export function clearSearch() {
  return {
    type: CLEAR_SEARCH,
  }
}


/**
 * Clear all search data.
 * 
 * @returns {Object} A redux-style action.
 */
export function clearSearchMetadata() {
  return {
    type: CLEAR_SEARCH_METADATA,
  }
}


/**
 * Clear multitext selections.
 * 
 * @returns {Object} A redux-style action.
 */
export function clearTexts() {
  return {
    type: CLEAR_TEXTS
  };
}


/**
 * Remove a text from the multitext selection.
 * 
 * @param {Object} text Valid text with object_id, author, and title.
 * @returns {Object} A redux-style action.
 */
export function removeText(text) {
  return {
    type: REMOVE_TEXT,
    payload: {
      texts: [text]
    }
  };
}


/**
 * Remove multiple texts from the multitext selection.
 * 
 * @param {Object[]} texts Valid texts with object_id, author, and title.
 * @returns {Object} A redux-style action.
 */
export function removeTexts(texts) {
  return {
    type: REMOVE_TEXTS,
    payload: {
      texts: texts
    }
  };
}


/**
 * Update multitext search results.
 * 
 * @param {Object[]} results The multitext search results to display.
 * @param {number} maxScore The maximum reported score in the results.
 * @returns {Object} A redux-style action.
 */
export function updateResults(results, maxScore) {
  return {
    type: UPDATE_RESULTS,
    payload: {
      results: results,
      maxScore: maxScore
    }
  }; 
}


/**
 * Update multitext search ID.
 * 
 * @param {String} searchID The multitext search ID.
 * @returns {Object} A redux-style action.
 */
export function updateSearchID(searchID) {
  return {
    type: UPDATE_SEARCHID,
    payload: {
      searchID: searchID
    }
  }; 
}


/**
 * Update multitext search results.
 * 
 * @param {String} status Multitext search status label.
 * @param {Object[]} progress Progress indicators for the multitext search.
 * @param {String} message Additional information about the status.
 * @returns {Object} A redux-style action.
 */
export function updateStatus(status, progress, message) {
  return {
    type: UPDATE_STATUS,
    payload: {
      message: message,
      progress: progress,
      status: status
    }
  }; 
}


/**
 * Reducer
 * 
 * This function commits changes requested by actions.
 */


/**
 * Update internal application state in reaction to an action.
 * 
 * @param {Object} state The current state of the application.
 * @param {Object} action The requested action to perform.
 * @returns {Object} A new state object with unaffected prior state and updates.
 */
export function multitextReducer(state = DEFAULT_STATE, action = {}) {
  switch (action.type) {
    case ADD_TEXT:
    case ADD_TEXTS:
      // Concatenate the current selected texts and the texts to be added.
      // To avoid collisions, ensure all texts have a unique object id.
      const concatTexts = uniqBy(
        [...state.selectedTexts, ...action.payload.texts],
        'object_id'
      );
      return {
        ...state,
        selectedTexts: concatTexts
      }
    case CLEAR_RESULTS:
      return {
        ...state,
        results: DEFAULT_STATE.results
      };
    case CLEAR_SEARCH:
      return {
        ...state,
        message: DEFAULT_STATE.message,
        results: DEFAULT_STATE.results,
        searchID: DEFAULT_STATE.searchID,
        status: DEFAULT_STATE.status
      };
    case CLEAR_SEARCH_METADATA:
      return {
        ...state,
        message: DEFAULT_STATE.message,
        status: DEFAULT_STATE.status
      };
    case CLEAR_TEXTS:
      return {
        selectedTexts: DEFAULT_STATE.selectedTexts
      }
    case REMOVE_TEXT:
    case REMOVE_TEXTS:
      // Take the difference of the current selected texts and texts to be
      // removed by compairng object ids.
      const diffTexts = differenceBy(
        state.selectedTexts,
        action.payload.texts,
        'object_id'
      );
      return {
        ...state,
        selectedTexts: diffTexts
      }
    case UPDATE_RESULTS:
    case UPDATE_SEARCHID:
    case UPDATE_STATUS:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}