/**
 * @fileoverview Corpus interactions with the REST API.
 * 
 * @author Jeff Kinnison <jkinniso@nd.edu>
 * 
 * @exports fetchLanguagesAction
 * @exports updateLanguageAction
 * @exports fetchTextsAction
 * @exports updateCurrentPageAction
 * @exports updateResultsPerPageAction
 * 
 * @requires NPM:axios
 * @requires ../state_management/search
 */
import axios from 'axios';
import maxBy from 'lodash/maxBy';

import { initiateAsyncAction, clearAsyncAction,
         registerErrorAction} from '../state_management/async';
import { updateAvailableLanguagesAction, updateAvailableTextsAction,
         updateSelectedLanguageAction } from '../state_management/corpus';


/**
 * URL of the REST API as defined in the environment.
 */
const REST_API = process.env.REACT_APP_REST_API_URL;


/**
 * Fetch available languages from the REST API.
 * 
 * @param {boolean} pending True if any AJAX calls are in progress.
 * @returns {function} Callback that calls dispatch to handle communication.
 */
export function fetchLanguagesAction(pending) {
  return dispatch => {
    // Only kick off a request to the REST API if no other requests are active.
    if (!pending) {
      // Update app state to show there is a new async action.
      dispatch(initiateAsyncAction());
      
      // Start a request to the languages endpoint of the REST API.
      // This creates a Promise that resolves when a reqponse or error is received.
      axios({
        method: 'get',
        url: `${REST_API}/languages`,
        crossDomain: true,
        responseType: 'json',
      })
      .then(response => {
        // On success, update the global state and return the languages.
        const languages = response.data.languages.map(item => item.toLowerCase()).sort();
        const latinIdx = languages.indexOf('latin');
        const greekIdx = languages.indexOf('greek');
        let language = '';
        if (latinIdx !== undefined) {
          language = 'latin';
        }
        else if (latinIdx === undefined && greekIdx !== undefined) {
          language = 'greek';
        }
        else {
          language = languages.length > 0 ? languages[0] : '';
        }

        dispatch(updateAvailableLanguagesAction(languages, language));
        dispatch(clearAsyncAction());
        return languages;
      })
      .catch(error => {
        // On error, update the error log.
        dispatch(registerErrorAction(error));
        dispatch(clearAsyncAction());
      });
    }
  }
}


/**
 * Update the selected language of the app.
 * 
 * @param {String} language The language to change to.
 * @returns {function} Callback that calls dispatch to update state.
 */
export function updateLanguage(language) {
  return dispatch => {
      dispatch(updateSelectedLanguageAction(language));
  }
}


/**
 * Fetch available texts of the selected language from the REST API.
 * 
 * @param {String} language The language of texts to fetch.
 * @param {boolean} shouldFetch True if a language was selected and no AJAX calls are in progress.
 * @returns {function} Callback that calls dispatch to handle communication.
 */
export function fetchTexts(language, shouldFetch) {
  return dispatch => {
    // Only kick off a request to the REST API if no other requests are active.
    if (shouldFetch) {
      // Update app state to show there is a new async action.
      dispatch(initiateAsyncAction());

      // Start a request to the texts endpoint of the REST API.
      // This creates a Promise that resolves when a reqponse or error is received.
      axios({
        method: 'get',
        url: `${REST_API}/texts`,
        crossDomain: true,
        responseType: 'json',
        params: {
          language: language
        }
      })
      .then(response => {
        // On success, update the global state and return the text list.
        const texts = response.data.texts.sort((a, b) => {
          return a.author > b.author || (a.author === b.author && a.title > b.title);
        });
        dispatch(updateAvailableTextsAction(response.data.texts));
        dispatch(clearAsyncAction());
        return response.data.texts;
      })
      .catch(error => {
        // On error, update the error log.
        dispatch(registerErrorAction(error));
        dispatch(clearAsyncAction());
      });
    }
  }
}
