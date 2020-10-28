import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import BlockIcon from '@material-ui/icons/Block';
import CloseIcon from '@material-ui/icons/Close';

import { fetchTexts, updateTextMetadata } from '../../api/corpus';
import ThemedDialog from '../common/ThemedDialog';


const useStyles = makeStyles(theme => ({
  input: {
    backgroundColor: '#ffffff',
    marginBottom: theme.spacing(2),
    width: '100%'
  },
  select: {
    backgroundColor: '#ffffff',
    width: '100%'
  },
  submitButton: {
    marginRight: theme.spacing(2)
  }
}))


function EditForm(props) {
  const { open, selectedText, closeDialog, updateTextMetadata } = props;
  
  const classes = useStyles();

  const defaultText = {
    author: '',
    object_id: '',
    title: '',
    year: undefined,
    is_prose: true
  };

  const [ newMetadata, setNewMetadata ] = useState({...defaultText});
  useEffect(() => {
    if (selectedText.object_id !== newMetadata.object_id) {
      setNewMetadata({...selectedText});
    }

    // return () => {
    //   setNewMetadata({...defaultText});
    // };
  }, [selectedText, newMetadata, setNewMetadata]);
  
  /** Flag indicating that all required fields are filled */
  const [ submitReady, setSubmitReady ] = useState(false);

  /**
   * Update the requested metadata field and determine if all are filled.
   * 
   * @param {String} label The metadata field to update.
   * @param {*} value The value to store in that field.
   */
  const updateMetadata = (label, value) => {
    setNewMetadata({...newMetadata, [label]: value});

    const metadataFilled = (
      (newMetadata.author !== '' &&
      newMetadata.title === '') &&
      (newMetadata.author !== selectedText.author ||
      newMetadata.title !== selectedText.title ||
      newMetadata.is_prose !== selectedText.is_prose ||
      newMetadata.year !== selectedText.year)
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
    <ThemedDialog
      actions={
        <div>     
          <Fab
            className={classes.submitButton}
            disabled={!submitReady}
            onClick={() => updateTextMetadata(newMetadata)}
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
      closeDialog={closeDialog}
      body={
        <div>
          <TextField
            className={classes.input}
            fullWidth
            key="author-field"
            onChange={(event) => updateMetadata('author', event.target.value)}
            placeholder="Author"
            required
            value={newMetadata.author}
            variant="outlined"
          />
          <TextField
            className={classes.input}
            fullWidth
            key="title-field"
            onChange={(event) => updateMetadata('title', event.target.value)}
            placeholder="Title"
            required
            value={newMetadata.title}
            variant="outlined"
          />
          <TextField
            className={classes.input}
            fullWidth
            key="year-field"
            onChange={(event) => updateMetadata('year', event.target.value)}
            placeholder="Year Published"
            type="number"
            value={newMetadata.year}
            variant="outlined"
          />
          <Select
            className={classes.select}
            fullWidth
            key="type-field"
            onChange={(event) => updateMetadata('is_prose', event.target.value)}
            placeholder="Text Type"
            renderValue={(value) => value ? 'Prose' : 'Poetry'}
            value={newMetadata.is_prose}
            variant="outlined"
          >
            <MenuItem value={false}>Poetry</MenuItem>
            <MenuItem value={true}>Prose</MenuItem>
          </Select>
        </div>
      }
      open={open}
      title="Edit Text Metadata"
    />
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
    language: state.corpus.language
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchTexts: fetchTexts,
    updateTextMetadata: updateTextMetadata
  }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(EditForm);