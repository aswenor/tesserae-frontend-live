/**
 * @fileoverview Search toolbar with UI controls and lanaguage selection.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports NavBar
 * 
 * @requires NPM:react
 * @requires NPM:prop-PropTypes
 * @requires NPM:redux
 * @requires NPM:react-redux
 * @requires NPM:@material-ui/core
 * @requires NPM:@material-ui/icons
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import MenuIcon from '@material-ui/icons/Menu';

import { fetchLanguagesAction, updateLanguageAction } from '../../../api/corpus';


/** 
 * Create WAI-ARIA props for a language tab.
 * 
 * @param {number} index The index of the tab (0-indexed).
 * @returns {object} WAI-ARIA properties for the tab.
 * 
 * @example
 *   return allyProps(0);
 */
const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


/**
 * Search interface control and language selection.
 * 
 * @component
 * 
 * @example
 *   const availableLanguages = ['greek', 'latin'];
 *   const fetchLanguages = () => { return {
 *     action: 'FETCH_LANGUAGES_ACTION',
 *     payload: ['english', 'hausa']
 *   }};
 *   const handlePanelOpen = (event) => event;
 *   return (
 *     <LanguagesAppBar
 *       availableLanguages={availableLanguages}
 *       fetchLanguages={true}
 *       handlePanelOpen={handlePanelOpen}
 *       open={true}
 *       pending={false}
 *       updateLanguage={false}
 *     />
 *   );
 */
function LanguagesAppBar(props) {
  const { availableLanguages, fetchLanguages, handlePanelOpen,
          open, pending, updateLanguage } = props;

  /**
   * Local state for tab management.
   */
  const [currentTab, setCurrentTab] = useState(0);

  // If no languages are loaded, attempt to load languages from the REST API.
  if (!availableLanguages || availableLanguages.length === 0) {
    fetchLanguages(pending);
  }

  /**
   * Update the selected language in the redux store and GUI.
   * 
   * @param {number} tabIdx The index of the new tab.
   * 
   * @example
   *   return handleChangeTab(1);
   */
  function handleChangeTab(tabIdx) {
    const language = availableLanguages[tabIdx];
    updateLanguage(language);
    setCurrentTab(tabIdx);
  }

  /** The tabs to display in the GUI. */
  let tabs = [];

  // If languages are loaded, create the tabs to switch between languages.
  if (availableLanguages && availableLanguages.length > 0) {
    tabs = availableLanguages.map((item, idx) => {
      return (
        <Tab
          key={item}
          label={item}
          value={idx}
          onClick={() => handleChangeTab(idx)}
          { ...a11yProps(idx) }
        />
      )
    });
  }

  return (
    <AppBar position="static">
      <Grid container
        alignContent="center"
        alignItems="flex-start"
        justify="flex-start"
      >
        <Hidden only={['xs', 'sm']}>
          <Grid item xs={1}>
            <IconButton
              ariaLabel={open
                         ? 'Hide Search Parameters'
                         : 'View Search Parameters'}
              onClick={handlePanelOpen}
            >
              <MenuIcon />
            </IconButton>
          </Grid>
        </Hidden>
        <Grid item md={11} xs={12}>
          <Tabs
            className={classes.tabs}
            value={currentTab}
          >
            {tabs}
          </Tabs>
        </Grid>
      </Grid>
    </AppBar>
  );
}


LanguagesAppBar.PropTypes = {
  /**
   * Languages exposed by the REST API.
   */
  availableLanguages: PropTypes.arrayOf(PropTypes.string),

  /**
   * Get available languages and update the redux store.
   */
  fetchLanguages: PropTypes.func,

  /**
   * Handle UI updates in SearchParametersForm
   */
  handlePanelOpen: PropTypes.func,

  /** 
   * Whether or not the SearchParametersForm is visible.
   */
  open: PropTypes.bool,

  /**
   * True if an AJAX call is in progress.
   */
  pending: PropTypes.bool,

  /**
   * True if the language must be updated in the redux store and GUI.
   */
  updateLanguage: PropTypes.bool
}


/**
 * Add redux store state to this component's props.
 * 
 * @param {object} state The global state of the application.
 * @returns {object} Members of the global state to provide as props.
 */
function mapStateToProps(state) {
  return {
    availableLanguages: state.availableLanguages,
    language: state.language,
    pending: state.asyncPending
  };
}


/**
 * Add redux store actions to this component's props.
 * @param {funciton} dispatch The redux dispatch function.
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchLanguages: fetchLanguagesAction,
    updateLanguage: updateLanguageAction
  }, dispatch);
}


// Do redux binding here.
export default connect(mapStateToProps, mapDispatchToProps)(LanguagesAppBar);
