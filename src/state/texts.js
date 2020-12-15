/**
 * Redux utilities for managing full text data.
 * 
 * @author Jeff Kinnison <jkinniso@nd.edu>
 * 
 * @exports DEFAULT_STATE
 * @exports addFullText
 * @exports addFullTexts
 * @exports clearFullTexts
 * @exports removeFullText
 * @exports removeFullTexts
 * @exports fullTextReducer
 * 
 * @requires NPM:lodash
 */
import { omit } from 'lodash';


/**
 * Default state for pagination.
 */
export const DEFAULT_STATE = {};


/**
 * Action identifiers to specify which update occurs.
 */
const ADD_FULL_TEXT = 'ADD_FULL_TEXT';
const ADD_FULL_TEXTS = 'ADD_FULL_TEXTS';
const CLEAR_FULL_TEXTS = 'CLEAR_FULL_TEXTS';
const REMOVE_FULL_TEXT = 'REMOVE_FULL_TEXT';
const REMOVE_FULL_TEXTS = 'REMOVE_FULL_TEXTS';


/**
 * Actions
 * 
 * These functions update the application state related to full text data.
 */


/**
 * Add full text data from the server.
 * 
 * @param {String} textID Database ID of the text to add.
 * @param {Object[]} units The text units to add.
 * @returns {Object} A redux-style action.
 */
export function addFullText(textID, units) {
  return {
    type: ADD_FULL_TEXT,
    payload: {
      [textID]: units
    }
  };
}


/**
 * Add full text data from the server.
 * 
 * @param {Object} textData Full texts with textID as key and data as value.
 * @returns {Object} A redux-style action.
 */
export function addFullTexts(textData) {
  return {
    type: ADD_FULL_TEXTS,
    payload: {
      ...textData
    }
  };
}


/**
 * Clear all full text data.
 * 
 * @returns {Object} A redux-style action.
 */
export function clearFullTexts() {
  return {
    type: CLEAR_FULL_TEXTS,
  };
}


/**
 * Remove full text data.
 * 
 * @param {String} textID Database ID of the text to remove.
 * @returns {Object} A redux-style action.
 */
export function removeFullText(textID) {
  return {
    type: REMOVE_FULL_TEXT,
    payload: {
      textIDs: [textID]
    }
  };
}


/**
 * Remove full text data.
 * 
 * @param {String} textIDs Database IDs of the texts to remove.
 * @returns {Object} A redux-style action.
 */
export function removeFullTexts(textIDs) {
  return {
    type: REMOVE_FULL_TEXTS,
    payload: {
      textIDs: textIDs
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
export function textsReducer(state = DEFAULT_STATE, action = {}) {
  switch (action.type) {
    case ADD_FULL_TEXT:
    case ADD_FULL_TEXTS:
      return {
        ...state,
        ...action.payload
      };
    case CLEAR_FULL_TEXTS:
      return DEFAULT_STATE;
    case REMOVE_FULL_TEXT:
    case REMOVE_FULL_TEXTS:
      return omit(state, action.payload.textIDs);
    default:
      return state;
  }
}