/**
 * @fileoverview Sidebar with text filter options.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports CorpusViewerSidebar
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:lodash
 * @requires NPM:@material-ui/core
 * @requires ../common/BodyScrollTable
 * @requires ../common/CorpusFilter
 * @requires ./SearchButtons
 */
import React from 'react';
import PropTypes from 'prop-types';
import { isObject } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import CorpusFilter from '../common/CorpusFilter';
import LanguageSelectMenu from '../common/LanguageSelectMenu';
import SearchButtons from './SearchButtons';


/** CSS styles to apply to the component. */
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    scrollbarColor: theme.palette.secondary.main,
    scrollbarWidth: 0,
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      backgroundColor: theme.palette.secondary.main,
      width: '0em',
      display: 'none'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      display: 'none',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      display: 'none',
      outline: '1px solid slategrey'
    }
  },
  spacer: {
    marginTop: theme.spacing(3)
  }
}));


/**
 * Sidebar with text filter options.
 * 
 * @component
 * @example
 *   let filter = {
 *     type: 'all',
 *     author: '',
 *     title: '',
 *     year: year: [-10000000, 100000000]
 *   };
 * 
 *   return (
 *     <CorpusViewerSidebar
 *       filter={filter}
 *       setFilter={() => {}}
 *     />
 *   );
 */
function CorpusViewerSidebar(props) {
  const { filter, setFilter } = props;

  /** CSS styles and global theme. */
  const classes = useStyles();

  return (
    <Box
      alignItems="center"
      className={classes.root}
      component="section"
      display="flex"
      flexDirection="column"
      flexGrow={1}
      height={'100%'}
      width={1}
    >
      <div className={classes.spacer}></div>
      <LanguageSelectMenu />
      <CorpusFilter
        authorFilter={filter.author}
        dateRangeFilter={filter.year}
        setAuthorFilter={(value) => setFilter(prev => ({...prev, author: isObject(value) ? value.author : value}))}
        setDateRangeFilter={(value) => setFilter(prev => ({...prev, year: value}))}
        setTitleFilter={(value) => setFilter(prev => ({...prev, title: isObject(value) ? value.title : value}))}
        setTypeFilter={(value) => setFilter(prev => ({...prev, type: value}))}
        titleFilter={filter.title}
        typeFilter={filter.type}
      />
      <div className={classes.spacer}></div>
      <SearchButtons />
    </Box>
  );
}


CorpusViewerSidebar.propTypes = {
  /**
   * Object containing values to filter texts by.
   */
  filter: PropTypes.shape({
    /**
     * Pattern to filter authors by.
     */
    author: PropTypes.string,

    /**
     * Pattern to filter titles by.
     */
    title: PropTypes.string,

    /**
     * All/Poetry/Prose filter.
     */
    type: PropTypes.string,

    /**
     * Start and end dates for the publication year range.
     */
    year: PropTypes.arrayOf(PropTypes.number)
  }),

  /**
   * Function to update filter values, (field, value) => void
   */
  setFilter: PropTypes.func
}


export default CorpusViewerSidebar;