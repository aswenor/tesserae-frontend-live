import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import ThemeProvider from '@material-ui/styles/ThemeProvider';

import LanguageSelectMenu from './LanguageSelectMenu';
import NavBar from './NavBar';
import createTesseraeTheme from '../../theme';

const useStyles = makeStyles(theme => ({
  button: {
    border: '1px solid #000000',
    background: '#ffffff'
  },
}))


function PageContainer(props) {
  const { children, routes, showLanguages } = props;

  const [ userTheme, setTheme ] = useState({palette: {primary: '#f69417', secondary: '#fdead1'}});

  const updateTheme = newTheme => setTheme(newTheme);

  return (
    <ThemeProvider theme={createTesseraeTheme(userTheme)}>
      <CssBaseline />
      <Box>
        <NavBar routes={routes} updateTheme={updateTheme}>
            <LanguageSelectMenu />
        </NavBar>
        {children}
      </Box>
    </ThemeProvider>
  );
}


export default PageContainer;