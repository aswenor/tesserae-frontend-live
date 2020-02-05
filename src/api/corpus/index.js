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
  //   else {
  //     dispatch(actions.fetchTextsSuccess([]))
  //   }
  }
}


export function updateSourceTextAction(event, value) {
  const realval = value ? value : {author: '', title: ''};
  return dispatch => dispatch(actions.updateSourceText(realval));
}


export function updateTargetTextAction(event, value) {
  const realval = value ? value : {author: '', title: ''};
  return dispatch => dispatch(actions.updateTargetText(realval));
}


export function updateSearchParametersAction(params) {
  return dispatch => dispatch(actions.updateSearchParameters(params))
}


export function fetchStoplistAction(feature, stopwords, stoplistBasis) {
  return dispatch => {
    console.log('fetching stoplist');
    dispatch(actions.fetchStoplistPending());

    let params = {
      feature: feature,
      list_size: stopwords,
    };

    if (stoplistBasis instanceof String) {
      params.language = stoplistBasis;
    }
    else {
      params.works = stoplistBasis;
    }

    axios({
      method: 'get',
      url: 'http://45.55.219.221:5000/stopwords',
      crossDomain: true,
      responseType: 'json',
      params: params
    })
    .then(response => {
      console.log(response.data.stopwords);
      dispatch(actions.fetchStoplistSuccess(response.data.stopwords))
      return response.data.stopwords
    })
    .catch(error => {
      dispatch(actions.fetchStoplistError(error))
    });
  }
}


export function initiateSearchAction(source, target, params, pending) {
  return dispatch => {
    if (!pending) {
      dispatch(actions.initiateSearchPending());
      axios({
          method: 'post',
          url: 'http://45.55.219.221:5000/parallels',
          crossDomain: true,
          responseType: 'json',
          data : {
            source: {
              object_id: source.object_id,
              unit: params.unit
            },
            target: {
              object_id: target.object_id,
              unit: params.unit
            },
            method: {
              name: 'original',
              feature: params.feature,
              stopwords: params.stopwords,
              freq_basis: params.frequencyBasis,
              max_distance: params.maxDistance,
              distance_basis: params.distanceBasis
            }
          }
      })
      .then(response => {
        const searchID = response.headers.split('/')[1]
        dispatch(actions.initiateSearchSuccess(searchID));
        return searchID;
      })
      .catch(error => {
        dispatch(actions.initiateSearchError(error));
      });
    }
  }
}


export function fetchResultsAction(searchID, pending) {
  return dispatch => {
    if (!pending) {
      dispatch(actions.fetchResultsPending());
      axios({
          method: 'post',
          url: `http://45.55.219.221:5000/parallels/${searchID}`,
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
