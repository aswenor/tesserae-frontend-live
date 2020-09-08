import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { differenceBy, groupBy, isEqual, findLastIndex } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TreeView from '@material-ui/lab/TreeView';
import Typography from '@material-ui/core/Typography';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import AuthorGroup from './AuthorGroup';
import CorpusFilter from '../common/CorpusFilter';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    display: 'flex',
    height: '100%',
    maxHeight: '100%',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    width: '100%',
  },
  filter: {
    height: '30%'
  },
  tree: {
    height: '70%',
    overflowY: 'scroll'
  }
}));


function filterText(text, filter) {
  let typeFilter = true;
  if (filter.type.toLowerCase() !== 'all') {
    const isProse = filter.type === 'prose';
    typeFilter = isProse === text.is_prose;
  }

  const authorFilter = (
    filter.author === '' ||
    text.author.toLowerCase().search(filter.author) >= 0);
  const titleFilter = (
    filter.title === '' ||
    text.title.toLowerCase().search(filter.title) >= 0);
  const yearFilter = (
    filter.year !== undefined &&
    text.year >= filter.year[0] || text.year <= filter.year[1]
  );

  return (typeFilter && authorFilter && titleFilter && yearFilter);
}


function MultitextParametersRight(props) {
  const { availableTexts, language, sourceText, targetText } = props;

  const classes = useStyles();

  const defaultFilter = {
    author: '',
    title: '',
    type: 'all',
    year: [-1000000, 1000000]
  };

  const [ filter, setFilter ] = useState(defaultFilter);

  useEffect(() => {
    console.log('using effect');
    if (!isEqual(filter, defaultFilter)) {
      setFilter({...defaultFilter});
    }
  }, [language, filter, setFilter]);

  const groupedTexts = groupBy(
    differenceBy(availableTexts, [sourceText, targetText])
      .filter(item => filterText(item, filter)),
    'author');
  console.log('groupedTexts', groupedTexts);

  const displayTexts = Object.keys(groupedTexts).sort().map(item => {
    return <AuthorGroup
      author={item}
      textList={groupedTexts[item]}
    />
  });

  console.log('displayTexts', displayTexts);

  return (
    <Grid container
      alignContent="center"
      alignItems="center"
      className={classes.root}
      justify="center"
    >
      <Grid item xs={12}
        className={classes.filter}
      >
        <Typography variant='h5'>Additional Targets</Typography>
        <CorpusFilter
          authorFilter={filter.author}
          dateRangeFilter={filter.year}
          setAuthorFilter={(value) => setFilter(prev => ({...filter, author: value}))}
          setDateRangeFilter={(value) => setFilter(prev => ({...filter, year: value}))}
          setTitleFilter={(value) => setFilter(prev => ({...filter, title: value}))}
          setTypeFilter={(value) => setFilter(prev => ({...filter, type: value}))}
          titleFilter={filter.title}
          typeFilter={filter.type}
        />
      </Grid>
      <Grid item xs={12}
        className={classes.tree}
      >
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {displayTexts}
        </TreeView>
      </Grid>
    </Grid>
  );
}


function mapStateToProps(state) {
  return {
    availableTexts: state.corpus.availableTexts,
    language: state.corpus.language,
    sourceText: state.search.sourceText,
    targetText: state.search.targetText
  }
}


export default connect(mapStateToProps)(MultitextParametersRight);