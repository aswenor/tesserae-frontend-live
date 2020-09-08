import axios from 'axios';

import { initiateAsync, clearAsync,
         registerError } from '../state/async';
import { updateAvailableLanguages, updateAvailableTexts,
         updateSelectedLanguage } from '../state/corpus';
import { }


/**
 * URL of the REST API as defined in the environment.
 */
const REST_API = process.env.REACT_APP_REST_API_URL;


export function initiateMultitextSearch(searchID, multitextSelections, asyncReady) {
  return dispatch => {
    if (asyncReady) {

    }
  };
}