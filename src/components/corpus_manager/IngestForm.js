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
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import BlockIcon from '@material-ui/icons/Block';

import { ingestText } from '../../api/corpus';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    margin: '5%'
  }
}))


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
  const { availableLanguages, ingestText } = props;

  const classes = useStyles();

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
    <Paper
      className={classes.root}
    >
      <Toolbar>
        <Typography variant='h5'>
          Ingest a Text
        </Typography>
      </Toolbar>
      <FormGroup
        aria-label="file-browser"
        row
      >
            <Input
              onChange={setFileName}
              type="file"
              value={fileName}
              variant="outlined"
            />
      </FormGroup>
      <FormGroup
        aria-label="language-input"
        row
      >
        <Select
          onChange={(event) => updateMetadata('language', event.target.value)}
          required
          value={metadata.language}
          variant="outlined"
        >
          {
            availableLanguages.map(item => {
              return <MenuItem key={item} value={item}>{item}</MenuItem>
            })
          }
        </Select>
      </FormGroup>
      <FormGroup
        aria-label="author-input"
        row
      >
        
            <TextField
              onChange={(event) => updateMetadata('author', event.target.value)}
              required
              value={metadata.author}
              variant="outlined"
            />
      </FormGroup>
      <FormGroup
        aria-label="title-input"
        row
      >
            <TextField
              onChange={(event) => updateMetadata('title', event.target.value)}
              required
              value={metadata.title}
              variant="outlined"
            />
      </FormGroup>
      <FormGroup
        aria-label="year-input"
        row
      >
        <FormControlLabel
          control={
            <TextField
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
          variant="extended"
        >
          {icon} Submit
        </Fab>
      </FormGroup>
    </Paper>
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