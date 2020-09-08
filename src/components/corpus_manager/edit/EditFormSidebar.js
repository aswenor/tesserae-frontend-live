import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { fetchTexts } from '../../../api/corpus';
import TextSelectDropdowns from '../../search/TextSelectDropdowns';


const useStyles = makeStyles(theme => ({
  gridItem: {
    margin: theme.spacing(2),
    marginTop: theme.spacing(3)
  }
}))


function EditFormSidebar(props) {
  const { availableTexts, fetchTexts, language, selectedText, setSelectedText,
          shouldFetch } = props;

  const classes = useStyles();

  if (shouldFetch) {
    fetchTexts(language, shouldFetch);
  }

  return (
    <Grid container
      alignContent="center"
      alignItems="center"
      justify="center"
    >
      <Grid item xs={12}
        className={classes.gridItem}
      >
        <TextSelectDropdowns
          handleAuthorChange={setSelectedText}
          handleTitleChange={setSelectedText}
          loading={availableTexts.length === 0}
          loadingText="Loading corpus"
          onOpen={() => {}}
          selection={selectedText}
          textList={availableTexts}
          title="Select a Text"
        />
      </Grid>
    </Grid>
  );
}


function mapStateToProps(state) {
  return {
    availableTexts: state.corpus.availableTexts,
    language: state.corpus.language,
    shouldFetch: (state.corpus.language !== '' && 
                  state.async.asyncPending < state.async.maxAsyncPending)
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchTexts: fetchTexts
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(EditFormSidebar);