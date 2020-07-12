import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import BlockIcon from '@material-ui/icons/Block';

import { fetchTexts, updateTextMetadata } from '../../api/corpus';
import TextSelectGroup from '../search/TextSelectGroup';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    margin: '5%',
    paddingBottom: '5%',
    paddingLeft: '5%',
    paddingRight: '5%',
    '& .MuiTextField-root': {
      backgroundColor: theme.palette.default.main,
      margin: theme.spacing(1),
      width: '50%',
    },
    '& .MuiSelect-root': {
      backgroundColor: theme.palette.default.main,
    },
    '& .MuiOutlinedSelect-root': {
      width: '50%'
    }
  },
  select: {
    width: '50%'
  },
  fab: {
    marginTop: "10px"
  }
}))


function EditForm(props) {
  const { asyncReady, availableTexts, fetchTexts, language,
          updateTextMetadata } = props;
  
  const classes = useStyles();

  const defaultText = {
    author: '',
    object_id: '',
    title: '',
    year: undefined,
    is_prose: false
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
    <Paper
      className={classes.root}
    >
      <Grid container
        alignItems="center"
        direction="column"
        justify="center"
        spacing={0}
      >
        <TextSelectGroup
          handleTextChange={onSelectText}
          loading={availableTexts.length === 0}
          loadingText="Loading text list..."
          onOpen={() => {fetchTexts(language, shouldFetchTexts)}}
          selection={selectedText}
          textList={availableTexts}
          title="Select a Text to Edit"
        />
        <Typography
          align="left"
          className={classes.heading}
          variant="h5"
        >
          Edit Metadata
        </Typography>
        <TextField
          label="Author"
          onChange={(event) => updateTextMetadata('author', event.target.value)}
          required
          value={newMetadata.author}
          variant="outlined"
        />
        <TextField
          label="Title"
          onChange={(event) => updateMetadata('title', event.target.value)}
          required
          value={newMetadata.title}
          variant="outlined"
        />
        <TextField
          label="Year Published"
          onChange={(event) => updateMetadata('year', event.target.value)}
          type="number"
          value={`${newMetadata.year}`}
          variant="outlined"
        />
        <Select
          className={classes.select}
          label="Genre"
          onChange={(event) => updateMetadata('is_prose', event.target.value === 'prose')}
          value={newMetadata.is_prose}
          variant="outlined"
        >
          <MenuItem value={false}>Poetry</MenuItem>
          <MenuItem value={true}>Prose</MenuItem>
        </Select>
        <Fab
          className={classes.fab}
          disabled={!submitReady}
          onClick={() => updateTextMetadata(newMetadata)}
          variant="extended"
        >
          {icon} Submit
        </Fab>
      </Grid>
    </Paper>
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