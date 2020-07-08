import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextInput from '@material-ui/core/TextInput';

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import BlockIcon from '@material-ui/core/Block';

import { fetchTexts, updateTextMetadata } from '../../api/corpus';
import TextSelectGroup from '../search/TextSelectGroup';


const useStyles = makeStyles(theme => ({}));


function EditForm(props) {
  const { asyncReady, availableTexts, language,
          updateTextMetadata } = props;

  const defaultText = {
    author: '',
    object_id: '',
    title: ''
  };

  const [ selectedText, setSelectedText ] = useState(defaultText);
  const [ newMetadata, setNewMetadata ] = useState({...defaultText});
  
  /** Flag indicating that all required fields are filled */
  const [ submitReady, setSubmitReady ] = useState(false);

  const shouldFetchTexts = asyncReady && availableTexts.length === 0;

  const onSelectText = (event, value) => {
    setSelectedText(value);
    setNewMetadata({...value});
  };

  /**
   * Update the requested metadata field and determine if all are filled.
   * 
   * @param {String} label The metadata field to update.
   * @param {*} value The value to store in that field.
   */
  const updateMetadata = (label, value) => {
    setNewMetadata({...newMetadata, [label]: value});

    const metadataFilled = (
      newMetadata.author !== '' &&
      newMetadata.language !== '' &&
      newMetadata.title === ''
    );

    if (metadataFilled) {
      setSubmitReady(true);
    }
    else {
      setSubmitReady(false);
    }
  };

  /** Icon to display on the submit button. */
  const icon = (submitReady ? <ArrowUpwardIcon /> : <BlockIcon />)

  return (
    <div>
      <TextSelectGroup
        handleTextChange={onSelectText}
        loading={availableTexts.length === 0}
        loadingText="Loading text list..."
        onOpen={() => fetchTexts(language, shouldFetchTexts)}
        selection={selectedText}
        textList={availableTexts}
        title="Select a Text to Edit"
      />
      <FormControl>
      <FormGroup
        aria-label="author-input"
        row
      >
        <FormControlLabel
          control={
            <TextInput
              onChange={(event) => updateTextMetadata('author', event.target.value)}
              required
              value={newMetadata.author}
            />
          }
          label="*Author"
        />
      </FormGroup>
      <FormGroup
        aria-label="title-input"
        row
      >
        <FormControlLabel
          control={
            <TextInput
              onChange={(event) => updateMetadata('title', event.target.value)}
              required
              value={newMetadata.title}
            />
          }
          label="*Title"
        />
      </FormGroup>
      <FormGroup
        aria-label="year-input"
        row
      >
        <FormControlLabel
          control={
            <TextInput
              onChange={(event) => updateMetadata('year', event.target.value)}
              type="number"
              value={newMetadata.author}
            />
          }
          label="Year of Publication"
        />
      </FormGroup>
      <FormGroup
        aria-label="genre-input"
        row
      >
        <FormControlLabel
          control={
            <Select
              onChange={(event) => updateMetadata('is_prose', event.target.value === 'prose')}
              value={newMetadata.title}
            >
              <MenuItem value='poetry'>Poetry</MenuItem>
              <MenuItem value='prose'>Prose</MenuItem>
            </Select>
          }
          label="Genre"
        />
      </FormGroup>
      <FormGroup
        aria-label="submit-button"
        row
      >
        <Fab
          disabled={!submitReady}
          onClick={() => updateTextMetadata(newMetadata)}
        >
          {icon} Submit
        </Fab>
      </FormGroup>
      </FormControl>
    </div>
  );
}


EditForm.propTypes = {
  asyncReady: PropTypes.bool,
  availableTexts: PropTypes.arrayOf(
    PropTypes.shape({
      author: PropTypes.string,
      is_prose: PropTypes.bool,
      object_id: PropTypes.string,
      title: PropTypes.string,
      year: PropTypes.number
    })
  )
};


function mapStateToProps(state) {
  return {
    asyncReady: state.async.asyncPending < state.async.maxAsyncPending,
    availableTexts: state.corpus.availableTexts,
    language: PropTypes.string
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateTextMetadata: updateTextMetadata
  }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(EditForm);