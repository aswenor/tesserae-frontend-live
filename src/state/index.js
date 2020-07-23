/**
 * Combined state management for the Tesserae frontend.
 * 
 * @author Jeff Kinnison <jkinniso@nd.edu>
 * 
 * @exports tesseraeReducer
 * 
 * @requires NPM:redux
 * @requires ./async
 * @requires ./corpus
 * @requires ./multitext
 * @requires ./pagination
 * @requires ./search
 */

import { combineReducers } from 'redux';

import { DEFAULT_STATE as asyncDefault, asyncReducer } from './async';
import { DEFAULT_STATE as corpusDefault, corpusReducer } from './corpus';
import { DEFAULT_STATE as multitextDefault, multitextReducer } from './multitext';
import { DEFAULT_STATE as paginationDefault, paginationReducer } from './pagination';
import { DEFAULT_STATE as searchDefault, searchReducer } from './search';


/**
 * Default state for the Tesserae app.
 */
export const DEFAULT_STATE = {
  async: asyncDefault,
  corpus: corpusDefault,
  multitext: multitextDefault,
  pagination: paginationDefault,
  search: searchDefault
}


/**
 * Combine the reducers for all branches of state.
 */
export const tesseraeReducer = combineReducers({
  async: asyncReducer,
  corpus: corpusReducer,
  multitext: multitextReducer,
  pagination: paginationReducer,
  search: searchReducer
});