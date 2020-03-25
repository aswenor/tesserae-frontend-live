import axios from 'axios';

import * as actions from '../../state_management/search';

const REST_API = process.env.REACT_APP_REST_API_URL;


export function fetchLanguagesAction(pending) {
  return dispatch => {
    if (!pending) {
      dispatch(actions.fetchLanguagesPending);
      axios({
        method: 'get',
        url: `${REST_API}/languages`,
        crossDomain: true,
        responseType: 'json',
      })
      .then(response => {
        dispatch(actions.fetchLanguagesSuccess(response.data.languages));
        return response.data.languages;
      })
      .catch(error => {
        dispatch(actions.fetchLanguagesError(error));
      });
    }
  }
}


export function updateLanguageAction(language) {
  return dispatch => {
      dispatch(actions.updateLanguage(language));
  }
}


export function fetchTextsAction(language, shouldFetch) {
  return dispatch => {
    if (shouldFetch) {
      dispatch(actions.fetchTextsPending());
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
        dispatch(actions.fetchTextsSuccess(response.data.texts));
        return response.data.texts;
      })
      .catch(error => {
        dispatch(actions.fetchTextsError(error));
      });
    }
  }
}


export function updateSourceTextAction(event, value) {
  const realval = value.object_id !== undefined ? value : {author: '', title: ''};
  return dispatch => dispatch(actions.updateSourceText(realval));
}


export function updateTargetTextAction(event, value) {
  const realval = value.object_id !== undefined ? value : {author: '', title: ''};
  return dispatch => dispatch(actions.updateTargetText(realval));
}


export function updateSearchParametersAction(params) {
  return dispatch => dispatch(actions.updateSearchParameters(params))
}


export function fetchStoplistAction(feature, stopwords, stoplistBasis, pending) {
  return dispatch => {
    if (!pending) {
      dispatch(actions.fetchStoplistPending());

      let params = {
        feature: feature,
        list_size: stopwords,
      };

      if (stoplistBasis instanceof Array) {
        params.works = stoplistBasis;
      }
      else {
        params.language = stoplistBasis;
      }

      axios({
        method: 'get',
        url: `${REST_API}/stopwords`,
        crossDomain: true,
        responseType: 'json',
        params: params
      })
      .then(response => {
        dispatch(actions.fetchStoplistSuccess(response.data.stopwords))
        return response.data.stopwords
      })
      .catch(error => {
        dispatch(actions.fetchStoplistError(error))
      });
    }
  }
}


export function initiateSearchAction(source, target, params, stopwords, pending) {
  return dispatch => {
    if (!pending) {
      dispatch(actions.initiateSearchPending());
      axios({
          method: 'post',
          url: `${REST_API}/parallels/`,
          crossDomain: true,
          headers: {
            contentType: 'x-www-form-urlencoded'
          },
          responseType: 'json',
          data : {
            source: {
              object_id: source.object_id,
              units: params.unitType
            },
            target: {
              object_id: target.object_id,
              units: params.unitType
            },
            method: {
              name: 'original',
              feature: params.feature,
              stopwords: stopwords,
              freq_basis: params.frequencyBasis,
              max_distance: parseInt(params.maxDistance, 10),
              distance_basis: params.distanceBasis
            }
          }
      })
      .then(response => {
        if (response.headers.location !== undefined) {
          const searchID = response.headers.location.split('/')[4];
          dispatch(actions.initiateSearchSuccess(searchID));
          return searchID;
        }

        if (response.data.parallels !== undefined) {
          dispatch(actions.fetchResultsSuccess(response.data.parallels));
        }
        
        return undefined;
      })
      .catch(error => {
        dispatch(actions.initiateSearchError(error));
      });
    }
  }
}


export function getSearchStatusAction(searchID, pending) {
  return dispatch => {
    if (!pending) {
      dispatch(actions.getSearchStatusPending);
      axios({
        method: 'get',
        url: `${REST_API}/parallels/${searchID}/status/`,
        crossDomain: true,
        responseType: 'json'
      })
      .then(response => {
        const done = response.data.status === 'Done';
        dispatch(actions.getSearchStatusSuccess(response.data.status, done));
      })
      .catch(error => {
        dispatch(actions.getSearchStatusError(error));
      })
    }
  }
}


export function fetchResultsAction(searchID, pending) {
  return dispatch => {
    if (!pending) {
      dispatch(actions.fetchResultsPending());
      axios({
          method: 'get',
          url: `${REST_API}/parallels/${searchID}`,
          crossDomain: true,
          responseType: 'json'
      })
      .then(response => {
        dispatch(actions.fetchResultsSuccess(response.data.parallels));
        return response.data.parallels;
      })
      .catch(error => {
        dispatch(actions.fetchResultsError(error));
      });
    }
  }
}


export function updateCurrentPageAction(event, value) {
  return dispatch => dispatch(actions.updateCurrentPage());
}


export function updateRowsPerPageAction(event, value) {
  return dispatch => dispatch(actions.updateRowsPerPage());
}
