import axios from 'axios';

import * as actions from '../../state_management/search';


export function fetchLanguagesAction(pending) {
  return dispatch => {
    if (!pending) {
    console.log('fetching languages')
      dispatch(actions.fetchLanguagesPending);
      axios({
        method: 'get',
        url: 'http://45.55.219.221:5000/languages',
        crossDomain: true,
        responseType: 'json',
      })
      .then(response => {
        dispatch(actions.fetchLanguagesSuccess(response.data.languages));
        return response.data.languages;
      })
      .catch(error => {
        console.log(error)
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
        url: 'http://45.55.219.221:5000/texts',
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
        url: 'http://45.55.219.221:5000/stopwords',
        crossDomain: true,
        responseType: 'json',
        params: params
      })
      .then(response => {
        console.log("success", response.data.stopwords);
        dispatch(actions.fetchStoplistSuccess(response.data.stopwords))
        return response.data.stopwords
      })
      .catch(error => {
        console.log("error", error.response.data);
        dispatch(actions.fetchStoplistError(error))
      });
    }
  }
}


export function initiateSearchAction(source, target, params, stopwords, pending) {
  console.log('initiating search', params);
  return dispatch => {
    if (!pending) {
      dispatch(actions.initiateSearchPending());
      axios({
          method: 'post',
          url: 'http://45.55.219.221:5000/parallels/',
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
        console.log(response)
        if (response.headers.location !== undefined) {
          const searchID = response.headers.location.split('/')[4];
          console.log('got id', searchID);
          dispatch(actions.initiateSearchSuccess(searchID));
          return searchID;
        }

        if (response.data.parallels !== undefined) {
          console.log('initiate got results', response.data.parallels)

          dispatch(actions.fetchResultsSuccess(response.data.parallels));
        }
        
        return undefined;
      })
      .catch(error => {
        console.log(error);
        dispatch(actions.initiateSearchError(error));
      });
    }
  }
}


export function getSearchStatusAction(searchID, pending) {
  console.log('Getting search status');
  return dispatch => {
    if (!pending) {
      dispatch(actions.getSearchStatusPending);
      axios({
        method: 'get',
        url: `http://45.55.219.221:5000/parallels/${searchID}/status/`,
        crossDomain: true,
        responseType: 'json'
      })
      .then(response => {
        console.log('got status', response.data.status);
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
  console.log('Fetching results')
  return dispatch => {
    if (!pending) {
      dispatch(actions.fetchResultsPending());
      axios({
          method: 'get',
          url: `http://45.55.219.221:5000/parallels/${searchID}`,
          crossDomain: true,
          responseType: 'json'
      })
      .then(response => {
        console.log('Got results', response.data.parallels.length)
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
