/**
 * @fileoverview Standard location for utility functions.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports toTitleCase
 * @exports getTotalWidth
 * @exports sleep
 * 
 * @requires NPM:react
 * @requires NPM:@material-ui/core
 */
import React from 'react';
import { bind } from "lodash";

import Typography from '@material-ui/core/Typography';


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


/**
 * Highlight relevant tokens in a snippet.
 * 
 * @param {String} snippet The snippet to highlight.
 * @param {String} tag Locus identifier for the snippet.
 * @param {Array} matchIndices The indices of the tokens to highlight.
 * @returns {Array} A list of Typography components with matches highlighted.
 */
export function highlightMatches(snippet, tag, matchIndices) {
  /** Array of highlighted tokens. */
  let highlightedSnippet = [];

  /** Split the snippet along whitespace. */
  let snippetTokens = snippet.split(/[\s.?!,;:/]+/);
  
  /** The current token index to inspect. */
  let current = 0;

  /** The next match token index. */
  let next = null;

  /** The current slice of the snippet to wrap. */
  let slice = null;

  // Iterate over the match indices, extract token slices, and highlight
  // relevant tokens.
  while (matchIndices.length > 0 || current < snippetTokens.length) {
    // Get the index of the next match token.
    next = matchIndices.shift();

    // If the current token is the next match token, highlight it.
    if (current === next) {
      slice = snippetTokens.slice(current, next + 1);
      highlightedSnippet.push(
        <Typography
            color="primary"
            component="span"
            key={`${tag} ${current},${next + 1}`}
          >
            {` ${slice.join(' ')}`}
          </Typography>
      );
      current = next + 1;
    }

    // If no more matches are found, slice into the remaining tokens and
    // wrap them without a highlight.
    else if (next === undefined) {
      slice = snippetTokens.slice(current, snippetTokens.length);

      highlightedSnippet.push(
        <Typography
          color="textPrimary"
          component="span"
          key={`${tag} ${current},${snippetTokens.length}`}
        >
          {` ${slice.join(' ')}`}
        </Typography>
      );
      
      current = snippetTokens.length;
    }

    // Otherwise, get the span of tokens leading up to the next match token
    // and wrap them without highlight, then get the match token and
    // highlight it.
    else {
      slice = snippetTokens.slice(current, next);
      highlightedSnippet.push(
        <Typography
          color="textPrimary"
          component="span"
          key={`${tag} ${current},${next}`}
        >
          {` ${slice.join(' ')}`}
        </Typography>
      );

      slice = snippetTokens.slice(next, next + 1);
      highlightedSnippet.push(
        <Typography
          color="primary"
          component="span"
          key={`${tag} ${next},${next + 1}`}
        >
          {` ${slice.join(' ')}`}
        </Typography>
      );

      current = next + 1;
    }
  }

  return highlightedSnippet;
}