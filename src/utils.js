/**
 * @fileoverview Standard location for utility functions.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports toTitleCase
 * @exports getTotalWidth
 * @exports sleep
 */

import { bind } from "lodash";


/**
 * Convert a multi-word string to title case.
 * 
 * @param {String} str The string to convert.
 * 
 * @returns {String} `str` with the first letter of each word capitalized.
 * 
 * @todo Include the option to ignore words (per language?).
 * 
 * @example
 *   let title = 'bellum civile';
 *   return toTitleCase(title);
 */
export function toTitleCase(str) {
  return str.toLowerCase().split().map(item => {
    if (item.length > 1) {
      return item.charAt(0).toUpperCase() + item.substring(1)
    }
    else {
      return item
    }
  }).join(' ');
}


/**
 * Get the total width of the browser window right now.
 * 
 * @returns {number} The width of the window in pixels.
 * 
 * @example
 *   return getTotalWidth();
 */
export function getTotalWidth() {
  return window.innerWidth !== null
    ? window.innerWidth
    : window.document.documentElement.clientWidth
}


/**
 * Busy wait for some amount of time.
 * 
 * @param {number} ms The amount of time to sleep in milliseconds.
 * @returns {Promise} Async Promise to await on for a blocking sleep.
 * 
 * @example
 *  return sleep(5000);
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
