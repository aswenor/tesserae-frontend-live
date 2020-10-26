/**
 * Redux utilities for managing tables more gracefully.
 * 
 * @author Jeff Kinnison <jkinniso@nd.edu>
 * 
 * @exports DEFAULT_STATE
 * @exports resetPagination
 * @exports updatePagination
 * @exports paginationReducer
 */


/**
 * Default state for pagination.
 */
export const DEFAULT_STATE = {
  currentPage: 0,
  rowsPerPage: 100,
  sortHeader: 'score',
  sortOrder: -1
};


/**
 * Action identifiers to specify which update occurs.
 */
const RESET_PAGINATION = 'RESET_PAGINATION';
const UPDATE_PAGINATION = 'UPDATE_PAGINATION';


/**
 * Actions
 * 
 * These functions update the application state related to async communucations.
 */


/**
 * Reset the pagaination to its defaults.
 * 
 * @returns {Object} A redux-style action.
 */
export function resetPagination() {
  return {
    type: RESET_PAGINATION,
    payload: { ...DEFAULT_STATE }
  }
}


/**
 * Update the display settings of the table.
 * 
 * @param {Object} paginationSettings Changes to make to table pagination.
 * @returns {Object} A redux-style action.
 */
export function updatePagination(paginationSettings = DEFAULT_STATE) {
  return {
    type: UPDATE_PAGINATION,
    payload: { ...paginationSettings }
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
export function paginationReducer(state = DEFAULT_STATE, action = {}) {
  switch (action.type) {
    case RESET_PAGINATION:
    case UPDATE_PAGINATION:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}