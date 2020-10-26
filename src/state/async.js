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
  asyncPending: 0,  // The number of active AJAX requests
  errors: [],  // Error queue for AJAX requests
  maxAsyncPending: 10,  // The max allowed active AJAX requests
  maxErrorQueueSize: 10,  // Maximum error queue size
  multitextSearchInProgress: false,
  searchInProgress: false
};


/**
 * Action identifiers to specify which update occurs.
 */
const INITIATE_ASYNC = 'INITIATE_ASYNC';
const CLEAR_ASYNC = 'CLEAR_ASYNC';
const REGISTER_ERROR = 'REGISTER_ERROR';
const CLEAR_ERROR = 'CLEAR_ERROR';
const UPDATE_MULTITEXT_IN_PROGRESS = 'UPDATE_MULTITEXT_IN_PROGRESS';
const UPDATE_SEARCH_IN_PROGRESS = 'UPDATE_SEARCH_IN_PROGRESS';


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
 * Set or unset the multitextSearchInProgress flag.
 * 
 * @param {Boolean} inProgress Updated flag.
 * @returns {Object} A redux-style action.
 */
export function updateMultitextInProgress(inProgress = DEFAULT_STATE.multitextSearchInProgress) {
  return {
    type: UPDATE_MULTITEXT_IN_PROGRESS,
    payload: {
      multitextSearchInProgress: inProgress
    }
  }
}


/**
 * Set or unset the searchInProgress flag.
 * 
 * @param {Boolean} inProgress Updated flag.
 * @returns {Object} A redux-style action.
 */
export function updateSearchInProgress(inProgress = DEFAULT_STATE.searchInProgress) {
  return {
    type: UPDATE_SEARCH_IN_PROGRESS,
    payload: {
      searchInProgress: inProgress
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
      return {
        ...state,
        asyncPending: Math.min(state.asyncPending + 1, state.maxAsyncPending)
      };
    case CLEAR_ASYNC:
      return {
        ...state,
        asyncPending: Math.max(state.asyncPending - 1, 0)
      };
    case REGISTER_ERROR:
      let errors = [...state.errors, action.payload.error];
      
      if (errors.length >= state.errorQueueSize) {
        const diff = errors.length - state.maxErrorQueueSize;
        errors = state.errors.slice(diff, errors.length);
      }

      return {
        ...state,
        errors: [...errors]
      }
    case CLEAR_ERROR:
      return {
        ...state,
        errors: state.errors.splice(action.payload.error, 1)
      };
    case UPDATE_SEARCH_IN_PROGRESS:
    case UPDATE_MULTITEXT_IN_PROGRESS:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state;
  }
}