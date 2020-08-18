/**
 * @fileoverview Interface for selecting additional texts in multitext search.
 * 
 * 
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { differenceBy, groupBy } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';

import AuthorGroup from './AuthorGroup';
import MultitextFilter from './MultitextFilter';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    display: 'flex',
    overflow: 'overlay',
  }
}));


/**
 * Lexical sort by author then title.
 * 
 * @param {Array} texts The list of texts to sort.
 * @param {String} type One of 'all', 'prose', or 'poetry'.
 * @param {String} authorFilter Pattern to filter by author.
 * @param {String} titleFilter Pattern to filter by title.
 * @returns {Array} The list filtered and sorted by author and title.
 */
export function filterAndGroupTexts(texts = [], type='all', authorFilter='',
                                    titleFilter='') {
  // Filter by prose or poetry on request. If neither was provided as `type`
  // do not filter.
  if (type.toLowerCase().search(/prose|poetry/) >= 0) {
    // Sets up a flag for prose (true) or poetry (false)
    const typeFlag = type.toLocaleLowerCase() === 'prose';
    
    // `is_prose` is a bool indicating a text is prose or poetry,
    // so filter by equality to `typeFlag`.
    texts = texts.filter(x => x.is_prose === typeFlag);
  }

  // If a string is supplied to the author filter, filter by author.
  if (authorFilter !== '') {
    texts = texts.filter(x => {
      return x.author.toLowerCase().search(authorFilter) >= 0;
    });
  }

  // If a string is supplied to the title filter, filter by title.
  if (titleFilter !== '') {
    texts = texts.filter(x => {
      return x.title.toLowerCase().search(titleFilter) >= 0;
    });
  }

  // Convert the array of texts into an object with texts grouped by author.
  return groupBy(texts, 'author');
}


function MultitextSelector(props) {
  const { availableTexts, multitextSelections,
          sourceText, targetText } = props;

  const classes = useStyles();

  const [ typeFilter, setTypeFilter ] = useState('all');
  const [ authorFilter, setAuthorFilter ] = useState('');
  const [ titleFilter, setTitleFilter ] = useState('');

  const groupedTexts = filterAndGroupTexts(
    differenceBy(availableTexts, [sourceText, targetText], 'object_id'),
    typeFilter,
    authorFilter,
    titleFilter
  );

  console.log(groupedTexts);

  const displayTexts = Object.keys(groupedTexts).sort().map(item => {
    return <AuthorGroup
      author={item}
      textList={groupedTexts[item]}
    />
  });

  return (
    <Box
      className={classes.root}
      component="section"
      display="flex"
      flexDirection="column"
      flexGrow={1}
      height={'100%'}
      width={1}
    >
      <div
        className={classes.root}
      >
        <MultitextFilter
          setAuthorFilter={setAuthorFilter}
          setTitleFilter={setTitleFilter}
          setTypeFilter={setTypeFilter}
          typeFilter={typeFilter}
        />
        <Divider />
        {displayTexts}
      </div>
    </Box>
  )
}


MultitextSelector.propTypes = {
  /**
   * List of available texts in the given language.
   */
  availableTexts: PropTypes.arrayOf(
    PropTypes.shape({
      object_id: PropTypes.string,
      author: PropTypes.string,
      title: PropTypes.string
    })
  ),

  /**
   * Selected texts for multitext search.
   */
  multitextSelections: PropTypes.arrayOf(
    PropTypes.shape({
      object_id: PropTypes.string,
      author: PropTypes.string,
      title: PropTypes.string
    })
  ),

  /**
   * Selected source text.
   */
  sourceText: PropTypes.shape({
    object_id: PropTypes.string,
    author: PropTypes.string,
    title: PropTypes.string
  }),

  /**
   * Selected target text.
   */
  targetText: PropTypes.shape({
    object_id: PropTypes.string,
    author: PropTypes.string,
    title: PropTypes.string
  })
}


/**
 * Add redux store state to this component's props.
 * 
 * @param {object} state The global state of the application.
 * @returns {object} Members of the global state to provide as props.
 */
function mapStateToProps(state) {
  return {
    availableTexts: state.corpus.availableTexts,
    selectedTexts: state.multitext.selectedTexts,
    sourceText: state.search.sourceText,
    targetText: state.search.targetText
  }
}


/**
 * Add redux store actions to this component's props.
 * 
 * @param {function} dispatch The redux dispatch function.
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}


// Do redux binding here.
export default connect(mapStateToProps, mapDispatchToProps)(MultitextSelector);