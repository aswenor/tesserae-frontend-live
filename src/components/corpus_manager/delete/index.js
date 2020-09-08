import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

import DeleteForm from './DeleteForm';
import PageContainer from '../../common/PageContainer';

import { fetchTexts } from '../../../api/corpus';


function CorpusDeleter(props) {
  const { fetchTexts, language, routes, shouldFetch } = props;

  if (shouldFetch) {
    fetchTexts(language, shouldFetch);
  }

  return (
    <main>
      <PageContainer
        routes={routes}
        showLanguages
      >
        <DeleteForm />
      </PageContainer>
    </main>
  );
}


function mapStateToProps(state) {
  return {
    language: state.corpus.language,
    shouldFetch: (
      state.corpus.language !== '' &&
      state.async.asyncPending < state.async.maxAsyncPending
    )
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchTexts: fetchTexts
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(CorpusDeleter);