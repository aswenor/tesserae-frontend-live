import React from 'react';
import PropTypes from 'prop-types';
import { isObject } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import CorpusFilter from '../common/CorpusFilter';
import SearchButtons from './SearchButtons';


const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3) 
  }
}));


function CorpusViewerSidebar(props) {
  const { filter, setFilter } = props;

  const classes = useStyles();

  return (
    <Grid container
      alignContent="center"
      alignItems="center"
      className={classes.root}
      justify="center"
    >
      <Grid item xs={12}>
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
      </Grid>
      <Grid item xs={12}>
        <SearchButtons />
      </Grid>
    </Grid>
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