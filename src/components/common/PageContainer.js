import React, { useState } from 'react';

import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import ThemeProvider from '@material-ui/styles/ThemeProvider';

import LanguageSelectMenu from './LanguageSelectMenu';
import NavBar from './NavBar';
import createTesseraeTheme from '../../theme';


function PageContainer(props) {
  const { children, routes, showLanguages, sideBarOpen, toggleSideBar } = props;

  const [ userTheme, setTheme ] = useState({palette: {primary: '#f69417', secondary: '#fdead1'}});

  const updateTheme = newTheme => setTheme(newTheme);

  return (
    <ThemeProvider theme={createTesseraeTheme(userTheme)}>
      <CssBaseline />
      <Box>
        <NavBar
          routes={routes}
          updateTheme={updateTheme}
        >
            { showLanguages
              ? <LanguageSelectMenu sideBarOpen={sideBarOpen} toggleSideBar={toggleSideBar} />
              : <div />
            }
        </NavBar>
        {children}
      </Box>
    </ThemeProvider>
  );
}


export default PageContainer;