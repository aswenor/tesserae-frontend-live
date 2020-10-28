/**
 * @fileoverview Header columns with a button to ingest a text.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports CorpusViewerHeader
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:react-redux
 * @requires NPM:react-router-dom
 * @requires NPM:@material-ui/core
 * @requires NPM:@material-ui/icons
 * @requires ../common/FileUpload
 * @requires ../../api/corpus
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import BlockIcon from '@material-ui/icons/Block';
import CloseIcon from '@material-ui/icons/Close';

import FileUpload from '../common/FileUpload';
import { ingestText } from '../../api/corpus';
import ThemedDialog from '../common/ThemedDialog';


/** CSS styles to apply to the component. */
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    margin: theme.spacing(4),
    padding: theme.spacing(4),
    '& .MuiTextField-root': {
      backgroundColor: theme.palette.default.main,
      margin: theme.spacing(1),
      width: '75%',
    },
    '& .MuiSelect-root': {
      backgroundColor: theme.palette.default.main,
    },
    '& .MuiOutlinedSelect-root': {
      width: '75%'
    }
  },
  input: {
    backgroundColor: '#ffffff',
    marginBottom: theme.spacing(1)
  },
  select: {
    backgroundColor: '#ffffff',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  ingestButton: {
    marginRight: theme.spacing(2)
  }
}));


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
  const { availableLanguages, closeDialog, ingestText, open } = props;

  /** CSS styles and global theme. */
  const classes = useStyles();

  /** Tess filename and updater. */
  const [ file, setFile ] = useState({});

  /** Tess file metadata and updater. */
  const [ metadata, setMetadata ] = useState({
    author: '',
    isProse: false,
    language: '',
    title: '',
    year: 1
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
    // Since year 0 does not exist, skip it.
    if (label === 'year' && value === '0') {
      value = metadata.year === 1 ? '-1' : '1';
    }

    setMetadata({...metadata, [label]: value});

    const metadataFilled = (
      metadata.author !== '' &&
      metadata.language !== '' &&
      metadata.title === ''
    );

    if (file !== '' && metadataFilled) {
      setSubmitReady(true);
    }
    else {
      setSubmitReady(false);
    }
  };

  /** Icon to display on the submit button. */
  const icon = (submitReady ? <ArrowUpwardIcon /> : <BlockIcon />)

  return (
    <ThemedDialog
      actions={
        <div>
          <Fab
            className={classes.ingestButton}
            disabled={!submitReady}
            onClick={() => ingestText(file, metadata)}
            variant="extended"
          >
            {icon} Submit
          </Fab>
          <Fab
            onClick={closeDialog}
            variant="extended"
          >
            <CloseIcon /> Cancel
          </Fab>
        </div>
      }
      body={
        <div>
          <div>
            <FileUpload
              buttonIcon={<AddIcon />}
              buttonText="Upload"
              file={file}
              setFile={setFile}
            />
          </div>
          <Select
            className={classes.select}
            fullWidth
            id="ingest-language"
            label="Language"
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
          <TextField
            className={classes.input}
            fullWidth
            id="ingest-author"
            label="Author"
            onChange={(event) => updateMetadata('author', event.target.value)}
            required
            value={metadata.author}
            variant="outlined"
          />
          <TextField
            className={classes.input}
            fullWidth
            id="ingest-title"
            label="Title"
            onChange={(event) => updateMetadata('title', event.target.value)}
            required
            value={metadata.title}
            variant="outlined"
          />
          <TextField
            className={classes.input}
            fullWidth
            id="ingest-year"
            label="Year of Publication"
            onChange={(event) => updateMetadata('year', event.target.value)}
            type="number"
            value={metadata.year}
            variant="outlined"
          />
          <Select
            className={classes.select}
            fullWidth
            id="ingest-genre"
            label="Genre"
            onChange={(event) => updateMetadata('isProse', event.target.value)}
            value={metadata.isProse}
            variant="outlined"
          >
            <MenuItem value={false}>Poetry</MenuItem>
            <MenuItem value={true}>Prose</MenuItem>
          </Select>
        </div>
      }
      closeDialog={closeDialog}
      maxwidth="md"
      open={open}
      title="Ingest a Text"
    />
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
 * 
 * @param {function} dispatch The redux dispatch function.
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ingestText: ingestText
  }, dispatch);
}


// Do redux binding here.
export default connect(mapStateToProps, mapDispatchToProps)(IngestForm);