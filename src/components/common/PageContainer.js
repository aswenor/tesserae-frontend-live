/**
 * @fileoverview Generic page setup for consistent appearance.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:redux
 * @requires NPM:react-redux
 * @requires NPM:@material-ui/core
 * @requires ../../api/corpus
 * @requires ./LoadingScreen
 * @requires ./NavBar
 * @requires ../../theme
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import ThemeProvider from '@material-ui/styles/ThemeProvider';

import { fetchLanguages, fetchTexts } from '../../api/corpus';
import LoadingScreen from './LoadingScreen';
import NavBar from './NavBar';
import createTesseraeTheme from '../../theme';


const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
    margin: 0,
    overflow: 'hidden',
    padding: 0,
    width: '100vw'
  }
}));


/**
 * Generic page setup for consistent appearance.
 * 
 * @component
 * @example
 *   <PageContainer>
 *     <div>Hello</div>
 *   </PageContainer>
 */
function PageContainer(props) {
  const { asyncReady, children, corpusLoaded, fetchLanguages, fetchTexts,
          language, routes } = props;

  const classes = useStyles();

  const [ userTheme, setTheme ] = useState({palette: {primary: '#f69417', secondary: '#fdead1'}});

  const updateTheme = newTheme => setTheme(newTheme);

  if (language === '') {
    fetchLanguages(asyncReady);
  }

  if (language !== '' && !corpusLoaded) {
    fetchTexts(language, asyncReady);
  }

  return (
    <ThemeProvider theme={createTesseraeTheme(userTheme)}>
      <CssBaseline />
      { language !== '' && corpusLoaded
        ? <div 
            className={classes.root}
          >
            <NavBar
              routes={routes}
              updateTheme={updateTheme}
            /> 
            {children}
          </div>
        : <LoadingScreen />
      }
    </ThemeProvider>
  );
}


PageContainer.propTypes = {
  /**
   * Whether or not an async call may be initiated.
   */
  asyncReady: PropTypes.bool,

  /**
   * Whether or not the corpus has been loaded.
   */
  corpusLoaded: PropTypes.bool,

  /**
   * The currently loaded language.
   */
  language: PropTypes.string,

  /**
   * Routing data for different pages.
   */
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * Icon to display on the link.
       */
      icon: PropTypes.element,

      /**
       * URL of the link.
       */
      link: PropTypes.string,

      /**
       * Display name of the link.
       */
      name: PropTypes.string
    })
  )
}


/**
 * Add redux store state to this component's props.
 * 
 * @param {object} state The global state of the application.
 * @returns {object} Members of the global state to provide as props.
 */
function mapStateToProps(state) {
  return {
    asyncReady: state.async.asyncPending < state.async.maxAsyncPending,
    corpusLoaded: state.corpus.availableTexts.length > 0,
    language: state.corpus.language
  };
}

/**
 * Add redux store actions to this component's props.
 * 
 * @param {function} dispatch The redux dispatch function.
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchLanguages: fetchLanguages,
    fetchTexts: fetchTexts
  }, dispatch);
}


// Do redux binding here.
export default connect(mapStateToProps, mapDispatchToProps)(PageContainer);