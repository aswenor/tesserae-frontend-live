/**
 * @fileoverview Standard app theming for a unified appearance.
 *
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 *
 * @exports theme
 *
 * @requires NPM:@material-ui/core
 */

import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';


export default function createTesseraeTheme(userOptions) {
  const theme = createMuiTheme({
    palette: {
      default: {
        light: '#ffffff',
        main: '#ffffff',
      },
      primary: {
        light: userOptions.palette.primary, 
        main: userOptions.palette.primary
      },
      secondary: {
        light: userOptions.palette.secondary, 
        main: userOptions.palette.secondary
      }
    },
    typography: {
      fontFamily: [
        'Futura',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(',')
    },
    spacing: 8
  });
  return responsiveFontSizes(theme);
}


// export default theme;