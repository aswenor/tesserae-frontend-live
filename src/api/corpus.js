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
import { batch } from 'react-redux';
import { find, isUndefined, sortBy } from 'lodash';

import { initiateAsync,
         clearAsync,
         registerError } from '../state/async';
import { updateAvailableLanguages,
         updateAvailableTexts,
         updateSelectedLanguage } from '../state/corpus';
import { resetSearch,
         updateSourceText,
         updateTargetText } from '../state/search';
import { addFullText } from '../state/texts';


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
export function fetchLanguages(asyncReady) {
  return dispatch => {
    // Only kick off a request to the REST API if no other requests are active.
    if (asyncReady) {
      // Update app state to show there is a new async action.
      dispatch(initiateAsync());
      
      // Start a request to the languages endpoint of the REST API.
      // This creates a Promise that resolves when a reqponse or error is received.
      axios({
        method: 'get',
        url: `${REST_API}/languages/`,
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

        batch(() => {
          dispatch(updateAvailableLanguages(languages, language));
          dispatch(clearAsync());
        });

        return languages;
      })
      .catch(error => {
        // On error, update the error log.
        batch(() => {
          dispatch(registerError(error));
          dispatch(clearAsync());
        });
      });
    }
  };
}


/**
 * Update the selected language of the app.
 * 
 * @param {String} language The language to change to.
 * @returns {function} Callback that calls dispatch to update state.
 */
export function updateLanguage(language) {
  return dispatch => {
      batch(() => {
        dispatch(updateSelectedLanguage(language));
        dispatch(resetSearch());
      });
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
        url: `${REST_API}/texts/`,
        crossDomain: true,
        responseType: 'json',
        params: {
          language: language.toLowerCase()
        }
      })
      .then(response => {
        // On success, update the global state and return the text list.
        const texts = response.data.texts.sort((a, b) => {
          return a.author > b.author || (a.author === b.author && a.title > b.title);
        });

        batch(() => {
          dispatch(updateAvailableTexts(texts));

          let source = undefined;
          let target = undefined;

          if (language.toLowerCase() === 'latin') {
            source = find(texts, {author: 'vergil', title: 'aeneid'});
            target = find(texts, {author: 'lucan', title: 'bellum civile'});
          }
          else if (language.toLowerCase() === 'greek') {

          }

          dispatch(updateSourceText(!isUndefined(source) ? source : texts[0]));
          dispatch(updateTargetText(!isUndefined(target) ? target : texts[-1]));

          dispatch(clearAsync())
        });

        return texts;
      })
      .catch(error => {
        // On error, update the error log.
        batch(() => {
          dispatch(registerError(error));
          dispatch(clearAsync());
        });
      });
    }
  };
}


export function fetchFullText(textID, unit, asyncReady) {
  return dispatch => {
    if (asyncReady) {
      console.log('fetching the full text');
      dispatch(initiateAsync());

      axios({
        method: 'get',
        url: `${REST_API}/units/`,
        crossDomain: true,
        responseType: 'json',
        params: {
          unit_type: unit,
          works: textID,
        }
      })
      .then(response => {
        console.log('response', response)
        batch(() => {
          const units = sortBy(response.data.units, 'index');
          dispatch(addFullText(textID, units));
          dispatch(clearAsync());
        });
        return response.data.units;
      })
      .catch(error => {
        // On error, update the error log.
        batch(() => {
          dispatch(registerError(error));
          dispatch(clearAsync());
        });
      });
    }
  };
}


export function ingestText(tessFile, metadata) {
  return dispatch => {
    dispatch(initiateAsync());

    let data = FormData();
    data.set('metadata', metadata);
    data.set('file', tessFile);

    axios({
      method: 'post',
      url: `${REST_API}/texts/`,
      crossDomain: true,
      responseType: 'json',
      headers: {
        'Content-Type': 'multipart/form'
      },
      data: data
    }).then(response => {

    }).error(error => {
      // On error, update the error log.
      batch(() => {
        dispatch(registerError(error));
        dispatch(clearAsync());
      });
    });
  };
}


export function updateTextMetadata(textID, metadata) {
  return dispatch => {
    axios({
      method: 'patch',
      url: `${REST_API}/texts/${textID}/`,
      crossDomain: true,
      responseType: 'json',
      data: metadata
    }).then(response => {

    }).error(error => {
      // On error, update the error log.
      batch(() => {
        dispatch(registerError(error));
        dispatch(clearAsync());
      });
    });
  };
}


export function deleteTexts(textIDs) {
  return dispatch => {
    textIDs.map(item =>
      axios({
        method: 'delete',
        url: `${REST_API}/texts/${item.object_id}/`,
        crossDomain: true,
        responseType: 'json',
      }).then(response => {
        
      }).error(error => {
        // On error, update the error log.
        batch(() => {
          dispatch(registerError(error));
          dispatch(clearAsync());
        });
      })
    );
  };
}
