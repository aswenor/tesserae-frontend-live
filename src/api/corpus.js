/**
 * @fileoverview Corpus interactions with the REST API.
 * 
 * @author Jeff Kinnison <jkinniso@nd.edu>
 * 
 * @exports fetchLanguages
 * @exports fetchTexts
 * 
 * @requires NPM:axios
 * @requires ../state/async
 * @requires ../state/corpus
 */
import axios from 'axios';

import { initiateAsync, clearAsync,
         registerError } from '../state/async';
import { updateAvailableLanguages, updateAvailableTexts,
         updateSelectedLanguage } from '../state/corpus';
import { resetSearch } from '../state/search';


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
export function fetchLanguages(pending) {
  return dispatch => {
    // Only kick off a request to the REST API if no other requests are active.
    if (!pending) {
      // Update app state to show there is a new async action.
      dispatch(initiateAsync());
      
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

        dispatch(updateAvailableLanguages(languages, language));
        dispatch(clearAsync());
        return languages;
      })
      .catch(error => {
        // On error, update the error log.
        dispatch(registerError(error));
        dispatch(clearAsync());
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
      dispatch(updateSelectedLanguage(language));
      dispatch(resetSearch());
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
      dispatch(initiateAsync());

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
        dispatch(updateAvailableTexts(texts));
        dispatch(clearAsync());
        return response.data.texts;
      })
      .catch(error => {
        // On error, update the error log.
        dispatch(registerError(error));
        dispatch(clearAsync());
      });
    }
  }
}
