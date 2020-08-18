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
  selectedTexts: []
};


/**
 * Action identifiers to specify which update occurs.
 */

const ADD_TEXT = 'ADD_TEXT';
const ADD_TEXTS = 'ADD_TEXTS';
const CLEAR_TEXTS = 'CLEAR_TEXTS';
const REMOVE_TEXT = 'REMOVE_TEXT';
const REMOVE_TEXTS = 'REMOVE_TEXTS';


/**
 * Actions
 * 
 * These functions update the application state related to async communucations.
 */

/**
 * Add a text to the multitext selection.
 * 
 * @param {Object} text Valid text with object_id, author, and title.
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
 */
export function addTexts(texts) {
  return {
    type: ADD_TEXTS,
    payload: {
      text: texts
    }
  };
}


export function clearTexts() {
  return {
    type: CLEAR_TEXTS
  };
}


/**
 * Remove a text from the multitext selection.
 * 
 * @param {Object} text Valid text with object_id, author, and title.
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
 * @param {Array} texts Valid texts with object_id, author, and title.
 */
export function removeTexts(texts) {
  return {
    type: REMOVE_TEXTS,
    payload: {
      text: texts
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
        [...state.texts, ...action.payload.texts],
        'object_id'
      );
      return {
        ...state,
        selectedTexts: concatTexts
      }
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
        action.payload.selectedTexts,
        'object_id'
      );
      return {
        ...state,
        selectedTexts: diffTexts
      }
    default:
      return state;
  }
}