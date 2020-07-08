import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isString } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import TextInput from '@material-ui/core/TextInput';

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import BlockIcon from '@material-ui/icons/Block';

import { ingestText } from '../../api/corpus';


/**
 * Form to select a new text for ingest.
 * 
 * @component
 * @example
 *  return (
 *    <IngestForm
 *      availableLanguages={['Latin', 'Greek']}
 *      ingestText
 *    />
 *  );
 */
function IngestForm(props) {
  const [ availableLanguages, ingestText ] = props;

  /** Tess filename and updater. */
  const [ fileName, setFileName ] = useState('');

  /** Tess file metadata and updater. */
  const [ metadata, setMetadata ] = useState({
    author: '',
    isProse: false,
    language: '',
    title: '',
    year: 0
  });

  /** Flag indicating that all fields are filled */
  const [ submitReady, setSubmitReady ] = useState(false);

  /**
   * Update the requested metadata field and determine if all are filled.
   * 
   * @param {String} label The metadata field to update.
   * @param {*} value The value to store in that field.
   */
  const updateMetadata = (label, value) => {
    setMetadata({...metadata, [label]: value});

    const metadataFilled = (
      metadata.author !== '' &&
      metadata.language !== '' &&
      metadata.title === ''
    );

    if (fileName !== '' && metadataFilled) {
      setSubmitReady(true);
    }
    else {
      setSubmitReady(false);
    }
  };

  /** Icon to display on the submit button. */
  const icon = (submitReady ? <ArrowUpwardIcon /> : <BlockIcon />)

  return (
    <FormControl
      color="secondary"
      component="fieldset"
    >
      <FormLabel
        component="legend"
      >
        Submit a Text for Ingest
      </FormLabel>
      <FormGroup
        aria-label="file-browser"
        row
      >
        <FormControlLabel
          control={
            <Input
              onChange={setFileName}
              type="file"
              value={fileName}
            />
          }
          label="Browse"
        />
      </FormGroup>
      <FormGroup
        aria-label="language-input"
        row
      >
        <FormControlLabel
          control={
            <Select
              onChange={(event) => updateMetadata('language', event.target.value)}
              required
              value={metadata.language}
            >
              {
                availableLanguages.map(item => {
                  return <MenuItem key={item} value={item}>{item}</MenuItem>
                })
              }
            </Select>
          }
          label="*Language"
        />
      </FormGroup>
      <FormGroup
        aria-label="author-input"
        row
      >
        <FormControlLabel
          control={
            <TextInput
              onChange={(event) => updateMetadata('author', event.target.value)}
              required
              value={metadata.author}
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
              value={metadata.title}
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
              value={metadata.author}
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
              value={metadata.title}
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
          onClick={() => ingestText(fileName, metadata)}
        >
          {icon} Submit
        </Fab>
      </FormGroup>
    </FormControl>
  );
}


IngestForm.propTypes = {
  /**
   * The languages exposed through the REST API.
   */
  availableLanguages: PropTypes.arrayOf(PropTypes.string),

  /**
   * Function to submit the text and metadata to the REST API.
   */
  ingestText: PropTypes.func
};


/**
 * Add redux store state to this component's props.
 * 
 * @param {object} state The global state of the application.
 * @returns {object} Members of the global state to provide as props.
 */
function mapStateToProps(state) {
  return {
    availableLanguages: state.corpus.availableLanguages
  }
}


/**
 * Add redux store actions to this component's props.
 * @param {function} dispatch The redux dispatch function.
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ingestText: ingestText
  }, dispatch);
}


// Do redux binding here.
export default connect(mapStateToProps, mapDispatchToProps)(IngestForm);