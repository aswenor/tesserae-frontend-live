/**
 * @fileoverview Top navigation for language selection.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports LanguageSelectMenu
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:redux
 * @requires NPM:react-redux
 * @requires NPM:@material-ui/core
 * @requires NPM:@material-ui/icons
 * @requires ../../api/corpus
 */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import ThemeProvider from '@material-ui/styles/ThemeProvider';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';

import createTessTheme from '../../theme';
import { fetchLanguages, updateLanguage } from '../../api/corpus';


/** CSS styles to apply to the component. */
const useStyles = makeStyles(theme => ({
  button: {
    border: '1px solid #000000',
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.3)',
  },
  menuButton: {
    border: '1px solid #000000',
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.3)',
    background: '#bfbfbf'
  }
}))


const localTheme = {
  palette: {
    default: '#ffffff',
    primary: '#757575',
    secondary: '#757575'
  }
};


/**
 * Interface to select the language to search.
 * 
 * @component
 * 
 * @example
 *   let availableLanguages = [];
 *   const fetchLanguages = () => ['english', 'greek', 'latin'];
 *   let language = 'latin';
 *   const updateLanguage = (newLang) => {language = newLang};
 *   return (
 *     <LanguageSelectMenu
 *       availableLanguages={availableLanguages}
 *       fetchLanguages={fetchLanguages}
 *       language={language}
 *       updateLanguage={updateLanguage}
 *     />
 *   );
 */
function LanguageSelectMenu(props) {
  const { asyncReady, availableLanguages, fetchLanguages, language,
          sideBarOpen, toggleSideBar, updateLanguage } = props;
  
  /** CSS styles and global theme. */
  const classes = useStyles();

  /** Reference to anchor the dropdown popper to the ButtonGroup. */
  const anchorRef = useRef(null);

  /** The currently selected ID in the dropdown popper. */
  const [ selectedIdx, setSelectedIdx ] = useState(-1);

  /** Whether or not the dropdown popper is open. */
  const [ open, setOpen ] = useState(false);

  /** Update the language when clicking Greek or Latin. */
  const handleClick = (newLanguage) => {
    setSelectedIdx(-1); 
    setOpen(false);
    updateLanguage(newLanguage);
  };

  /** Update the language from a dropdown popper selection. */
  const handleItemSelect = (event, newLanguage, index) => {
    setSelectedIdx(index);
    setOpen(false);
    updateLanguage(newLanguage);
  };

  /** Close the dropdown popper. */
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  /** Toggle the dropdown popper open or closed. */
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  /** List of languages cast to lowercase. */
  let normedLangs = availableLanguages.map(l => l.toLowerCase());

  /** List of buttons to include in the selection interface. */
  let languageButtons = [];

  /** Element to use as the popper (empty if no languages are in the popper) */
  let popper = (<div />);

  // Get the available languages from the REST API if none are found.
  if (availableLanguages.length === 0) {
    fetchLanguages(asyncReady);
  }

  if (toggleSideBar) {
    languageButtons.push(
      <Button
        aria-label="toggle-sidebar"
        className={classes.menuButton}
        key="toggler"
        onClick={toggleSideBar}
        variant="contained"
      >
        <MenuOpenIcon />
      </Button>
    );
  }

  // If Latin is one of the languages, extract it from the list and add
  // an explicit button to the interface.
  let idx = normedLangs.indexOf('latin');
  if (idx >= 0) {
    languageButtons.push(
      <Button
        className={classes.button}
        color={language === 'latin' ? 'secondary' : 'default'}
        key="latin"
        onClick={event => handleClick('latin')}
        variant="contained"
      >
        Latin
      </Button>
    );

    // Remove 'latin' from the list of languages.
    normedLangs.splice(idx, 1);
  }

  // If Greek is one of the languages, extract it from the list and add
  // an explicit button to the interface.
  idx = normedLangs.indexOf('greek');
  if (idx >= 0) {
    languageButtons.push(
      <Button
        className={classes.button}
        color={language === 'greek' ? 'secondary' : 'default'}
        key="greek"
        onClick={event => handleClick('greek')}
        variant="contained"
      >
        Greek
      </Button>
    );

    // Remove 'greek' from the list of languages.
    normedLangs.splice(idx, 1);
  }

  // If additional languages beyond Greek and Latin are available, create
  // a dropdown button to select them.
  if (normedLangs.length > 0) {
    // Add a button to access the dropdown menu.
    languageButtons.push(
      <Button
        aria-controls={open ? 'additional-languages-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="menu"
        aria-label="select a language to search"
        onClick={handleToggle}
      >
        {language !== "greek" && language !== "latin" ? language : 'More...'} <ArrowDropDownIcon />
      </Button>
    );

    // Convert the remaining languages to dropdown menu items.
    const menuItems = normedLangs.sort().map((item, menuIdx) => {
      return (
        <MenuItem
          key={item}
          onClick={(event) => handleItemSelect(event, item, menuIdx)}
          selected={menuIdx === selectedIdx}
          value={item}
        >
          {item.toUpperCase()}
        </MenuItem>)
    });

    // Create a dropdown popper to select from the additional languages
    // that toggles on button click. See the Material-UI ButtonGroup
    // documentation for more information.
    popper = (
      <Popper
        anchorEl={anchorRef.current}
        disablePortal
        open={open}
        role={undefined}
        transition
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: 'right bottom'
            }}
          >
            <Paper>
              <ClickAwayListener
                onClickAway={handleClose}
              >
                <MenuList
                  id="additional-languages-menu"
                >
                  {menuItems}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    );
  }

  return (
    <Box>
      <ThemeProvider theme={createTessTheme(localTheme)}>
        <ButtonGroup
          ref={anchorRef}
        >
          {languageButtons}
        </ButtonGroup>
        {popper}
      </ThemeProvider>
    </Box>
  );
}


LanguageSelectMenu.propTypes = {
  /**
   * Flag determining if an AJAX call may be initiated.
   */
  asyncReady: PropTypes.bool,

  /**
   * Languages exposed by the REST API.
   */
  availableLanguages: PropTypes.arrayOf(PropTypes.string),

  /**
   * Get available languages and update the redux store.
   */
  fetchLanguages: PropTypes.func,

  /**
   * The current language populating the UI.
   */
  language: PropTypes.string,

  /**
   * Callback to update the languages exposed through the REST API.
   */
  updateLanguage: PropTypes.func
}


/**
 * Add redux store state to this component's props.
 * 
 * @param {object} state The global state of the application.
 * @returns {object} Members of the global state to provide as props.
 */
const mapStateToProps = state => ({
  asyncReady: state.async.asyncPending < state.async.maxAsyncPending,
  availableLanguages: state.corpus.availableLanguages,
  language: state.corpus.language,
});


/**
 * Add redux store actions to this component's props.
 * @param {funciton} dispatch The redux dispatch function.
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  fetchLanguages: fetchLanguages,
  updateLanguage: updateLanguage
}, dispatch);


// Do redux binding here.
export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelectMenu);