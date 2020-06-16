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
 * @requires ./search
 */

import { combineReducers } from 'redux';

import { DEFAULT_STATE as asyncDefault, asyncReducer } from './async';
import { DEFAULT_STATE as corpusDefault, corpusReducer } from './corpus';
import { DEFAULT_STATE as multitextDefault, multitextReducer } from './multitext';
import { DEFAULT_STATE as searchDefault, searchReducer } from './search';


/**
 * Default state for the Tesserae app.
 */
export const DEFAULT_STATE = {
  async: asyncDefault,
  corpus: corpusDefault,
  multitext: multitextDefault,
  search: searchDefault
}


/**
 * Reducer
 * 
 * This function commits changes requested by actions.
 */


export const tesseraeReducer = combineReducers({
  async: asyncReducer,
  corpus: corpusReducer,
  multitext: multitextReducer,
  search: searchReducer
});