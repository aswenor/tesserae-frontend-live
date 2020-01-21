import axios from 'axios';


export function getAvailableLanguages(config={}) {
  // const url = `${config.APIURL}:${config.APIPort}/languages`;
  // const languages = axios({
  //   method: 'get',
  //   url: url,
  //   responseType: 'json'
  // })
  // .then(
  //   response => response.data.languages
  // )
  // .catch(
  //   error => error
  // );
  //
  // return languages;
  return ['greek', 'latin'];
}


export function loadTextMetadata(language) {
  const url = `https://tess-new.caset.buffalo.edu/api/texts`;
  const texts = axios({
    method: 'get',
    url: url,
    responseType: 'json'
  })
  .then(
    response => response.data.texts
  )
  .catch(
    error => error
  );

  return texts;
  // if ( language.toLowerCase() === 'greek' ) {
  //   return [
  //     {
  //           "language": "greek",
  //           "title": "iliad",
  //           "author": "homer",
  //           "year": -1260,
  //           "unit_types": ["line", "phrase"],
  //           "path": "grc/homer.iliad.tess",
  //           "is_prose": false,
  //           "hash": "9777e8cf1abacec70a22735131ebed4c",
  //           "extras": {}
  //       },
  //       {
  //           "language": "greek",
  //           "title": "gorgias",
  //           "author": "plato",
  //           "year": -283,
  //           "unit_types": ["line", "phrase"],
  //           "path": "grc/plato.gorgias.tess",
  //           "is_prose": false,
  //           "hash": "9777e8cf1abacec70a22735131ebed4c",
  //           "extras": {}
  //       }
  //   ];
  // }
  // else if ( language.toLowerCase() === 'latin' ) {
  //   return [
  //     {
  //           "language": "latin",
  //           "title": "aeneid",
  //           "author": "vergil",
  //           "year": -19,
  //           "unit_types": ["line", "phrase"],
  //           "path": "la/vergil.aeneid.tess",
  //           "is_prose": false,
  //           "hash": "265386d760c39b01f17d640f167d388a",
  //           "extras": {}
  //       },
  //       {
  //           "language": "latin",
  //           "title": "bellum civile",
  //           "author": "lucan",
  //           "year": 61,
  //           "unit_types": ["line", "phrase"],
  //           "path": "la/lucan.bellum_civile.tess",
  //           "is_prose": false,
  //           "hash": "9777e8cf1abacec70a22735131ebed4c",
  //           "extras": {}
  //       }
  //   ];
  // }
  // else {
  //   return [];
  // }
}
