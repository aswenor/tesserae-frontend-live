/**
 * @fileoverview Top navigation bar.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports NavBar
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:react-router-dom
 * @requires NPM:@material-ui/core
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { differenceBy } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import Toolbar from '@material-ui/core/Toolbar';

import createTessTheme from '../../theme';
import PaletteSwapper from './PaletteSwapper';
import CorpusNavButton from './CorpusNavButton';
import routes from '../../routes';
import TessLogoButton from './TessLogoButton';


const mode = String(process.env.REACT_APP_MODE);


/** CSS styles to apply to the component. */
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    width: '100%'
  },
  button: {
    background: '#ffffff',
    border: '1px solid #000000',
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.3)',
  },
  header: {
    width: '50vh'
  },
  logo: {
    height: '100%',
    maxHeight: '50px',
    width: 'auto',
    margin: 0,
    padding: 0
  }
}));


const localTheme = {
  palette: {
    default: '#ffffff',
    primary: '#757575',
    secondary: '#757575'
  }
};

/**
 * Top navigation bar with a logo and links to pages in the app.
 *
 * @component
 *
 * @example
 *   const routes = [{link: '/', name: 'Home'},
 *                   {link: '/about': name: 'About'}];
 *   return <NavBar routes={routes} />
 */
function NavBar(props) {
  const { children, updateTheme } = props;

  /** CSS styles and global theme. */
  const classes = useStyles();

  let links = [];

  if (mode !== 'admin') {
    const corpusRoutes = routes.reverse().filter(item => !item.link.search(/^[/]corpus/));
    const corpusLinks = (
      <CorpusNavButton buttonText="Corpus" routes={corpusRoutes} />
    );
    /** Array of links to add to the top bar */

    const searchLinks = differenceBy(routes, corpusRoutes).map((route, i) => {
      return (
        <Button
          className={classes.button}
          component={Link}
          color="default"
          key={route.link}
          size="small"
          to={route.link}
        >
          {route.name}
        </Button>
      );
    });

    links = [corpusLinks, ...searchLinks];
  }
  else {
    links = routes.reverse().map((route, i) => {
      return (
        <Button
          className={classes.button}
          component={Link}
          color="default"
          key={route.link}
          size="small"
          to={route.link}
        >
          {route.name}
        </Button>
      );
    });
  }

  return (
    <AppBar className={classes.root} position="static">
      <ThemeProvider theme={createTessTheme(localTheme)}>
        <Toolbar>
          <Box
            alignItems="center"
            className={classes.header}
            display="flex"
            flexGrow={.5}
            justifyContent="flex-start"
          >
            {children}
          </Box>
          <Box
            alignItems="center"
            className={classes.header}
            display="flex"
            flexGrow={.5}
            justifyContent="flex-end"
            minWidth={.5}
          >
              {links}
              <PaletteSwapper updateTheme={updateTheme} />
              <TessLogoButton />
          </Box>
        </Toolbar>
      </ThemeProvider>
    </AppBar>
  );
}


NavBar.propTypes = {
  /**
   * The links to display in the nav bar.
   */
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * URL of this link.
       */
      link: PropTypes.string,

      /**
       * Display name of this link.
       */
      name: PropTypes.string
  })),

  /**
   * Function to toggle a sidebar on larger screens.
   */
  toggleSideBar: PropTypes.func
};


export default NavBar;
