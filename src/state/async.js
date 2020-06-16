/**
 * Redux utilities for managing async communications.
 * 
 * @author Jeff Kinnison <jkinniso@nd.edu>
 * 
 * @exports DEFAULT_STATE
 * @exports initiateAsync
 * @exports clearAsync
 * @exports registerError
 * @exports clearError
 * @exports asyncReducer
 */

/**
 * Default state for async communications.
 */
export const DEFAULT_STATE = {
  asyncPending: false,
  errors: []
};


/**
 * Action identifiers to specify which update occurs.
 */
const INITIATE_ASYNC = 'INITIATE_ASYNC';
const CLEAR_ASYNC = 'CLEAR_ASYNC';
const REGISTER_ERROR = 'REGISTER_ERROR';
const CLEAR_ERROR = 'CLEAR_ERROR';


/**
 * Actions
 * 
 * These functions update the application state related to async communucations.
 */


/**
 * Flag the start of an async request.
 * 
 * @returns {Object} A redux-style action.
 */
export function initiateAsync() {
  return {
    type: INITIATE_ASYNC,
    payload: {
      asyncPending: true
    }
  }
}


/**
 * Flag the end of an async request.
 * 
 * @returns {Object} A redux-style action.
 */
export function clearAsync() {
  return {
    type: CLEAR_ASYNC,
    payload: {
      asyncPending: false
    }
  }
}


/**
 * Add an error to the error message queue.
 * 
 * @param {Object} error The error state returned from Axios.
 * @returns {Object} A redux-style action.
 */
export function registerError(error) {
  return {
    type: REGISTER_ERROR,
    payload: {
      error: error
    }
  }
}


/**
 * Remove an error from the error message queue.
 * 
 * @param {Number} index The index of the error to clear from the queue.
 * @returns {Object} A redux-style action.
 */
export function clearError(index) {
  return {
    type: REGISTER_ERROR,
    payload: {
      error: index
    }
  }
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
export function asyncReducer(state = DEFAULT_STATE, action = {}) {
  switch (action.type) {
    case INITIATE_ASYNC:
    case CLEAR_ASYNC:
      return {
        ...state,
        ...action.payload
      };
    case REGISTER_ERROR:
      return {
        ...state,
        errors: [...state.errors, action.payload.error]
      }
    case CLEAR_ERROR:
      return {
        ...state,
        errors: state.errors.splice(action.payload.error, 1)
      };
    default:
      return state;
  }
}