import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { uniq } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { fetchTexts } from '../../api/corpus';
import TextSelectDropdowns from '../search/TextSelectDropdowns';
import TypeButtonGroup from './TypeButtonGroup';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  select: {
    backgroundColor: theme.palette.default.main,
    marginBottom: '10px',
    [theme.breakpoints.up('md')]: {

    },
    [theme.breakpoints.down('sm')]: {

    }
  }
}));


function MultitextFilter(props) {
  const { asyncReady, availableTexts, fetchTexts, language,
          setAuthorFilter, setTitleFilter, setTypeFilter,
          typeFilter } = props;

  const classes = useStyles();

  const [ authorSelection, setAuthorSelection ] = useState('');
  const [ titleSelection, setTitleSelection ] = useState('');

  const authorItems = uniq(availableTexts.map(item => item.author));
  const titleItems = availableTexts.map(item => item.title);

  const shouldFetchTexts = asyncReady && availableTexts.length === 0;

  return (
    <Grid container
      alignContent="center"
      alignItems="center"
      justify="center"
      spacing={2}
    >
      <Grid item xs={12}>
        <Typography variant="h6">
          Select Additional 
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TypeButtonGroup
          setTypeFilter={setTypeFilter}
          typeFilter={typeFilter}
        />
      </Grid>
      <Grid item xs={12}>
        <TextSelectDropdowns
          handleTextChange
          loading
          loadingText
          onOpen
          selection
          textList
          title=""
        />
      </Grid>
    </Grid>
  )
}


MultitextFilter.propTypes = {
  authorFilter: PropTypes.string,
  availableTexts: PropTypes.arrayOf(
    PropTypes.shape({
      author: PropTypes.string,
      title: PropTypes.string
    })
  ),
  language: PropTypes.string,
  setAuthorFilter: PropTypes.func,
  setTitleFilter: PropTypes.func,
  setTypeFilter: PropTypes.func,
  titleFilter: PropTypes.string,
  typeFilter: PropTypes.string
};


function mapStateToProps(state) {
  return {
    asyncReady: state.async.asyncPending < state.async.maxAsyncPending,
    availableTexts: state.corpus.availableTexts,
    language: state.corpus.language
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
      fetchTexts: fetchTexts
    }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(MultitextFilter);