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


/**
 * [Material UI theme object.](https://material-ui.com/customization/theming/)
 * 
 * @readonly
 */
const theme = createMuiTheme({
  typography: {
    fontFamily: [
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


export default responsiveFontSizes(theme);