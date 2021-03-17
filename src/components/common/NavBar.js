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
 * @requires ../../theme
 * @requires ../../routes
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link as InternalLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { Link as ExternalLink } from '@material-ui/core';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import Toolbar from '@material-ui/core/Toolbar';

import createTessTheme from '../../theme';
import routes from '../../routes';


/** CSS styles to apply to the component. */
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    width: '100%'
  },
  linkBox: {
    height: '100%',
    borderLeft: '1px solid black',
    borderRight: '1px solid black',
  },
  button: {
    background: '#ffffff',
    border: '1px solid #000000',
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.3)',
    marginLeft: '5px'
  },
  header: {
    width: '50vw'
  },
  headerLeft: {
    width: '50vw'
  },
  logo: {
    backgroundColor: '#ffffff',
    border: '1px solid black',
    borderRadius: '5px',
    height: '100%',
    margin: '10px',
    maxHeight: '50px',
    padding: 0,
    width: 'auto',
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
  /** CSS styles and global theme. */
  const classes = useStyles();

  const links = routes.filter(x => x.display).map((route, i) => {
    return (!route.external
      ? <Button
          className={classes.button}
          component={InternalLink}
          color="default"
          key={route.link}
          size="small"
          to={route.link}
        >
          {route.name}
        </Button>
      : <Button
          className={classes.button}
          component={ExternalLink}
          color="default"
          href={route.link}
          key={route.link}
          size="small"
        >
          {route.name}
        </Button>
    );
  });

  return (
    <AppBar className={classes.root} position="static">
      <ThemeProvider theme={createTessTheme(localTheme)}>
        <Toolbar>
          <Box
            alignItems="center"
            className={classes.header}
            display="flex"
            flexGrow={.7}
            justifyContent="flex-start"
          >
            <InternalLink
              to="/"
            >
              <img 
                alt="Tesserae Version 5"
                className={classes.logo}
                src="Tesserae.png"
              />
            </InternalLink>
          </Box>
          <Box
            alignItems="center"
            className={classes.header}
            display="flex"
            flexGrow={.3}
            height="100%"
            justifyContent="flex-end"
            minWidth={.3}
          >
            {links}
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
       * Flag to ignore the link in the nav bar.
       */
      display: PropTypes.bool,
      
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
