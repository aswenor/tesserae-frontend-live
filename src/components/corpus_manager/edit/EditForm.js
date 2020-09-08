import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import BlockIcon from '@material-ui/icons/Block';

import { fetchTexts, updateTextMetadata } from '../../../api/corpus';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    margin: '5%',
    padding: theme.spacing(6),
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
  divider: {
    marginBottom: theme.spacing(6),
    marginTop: theme.spacing(6),
    width: '90%'
  },
  select: {
    width: '75%'
  },
  fab: {
    marginTop: "10px"
  }
}))


function EditForm(props) {
  const { selectedText, updateTextMetadata } = props;
  
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
      newMetadata.author !== '' &&
      newMetadata.title === '' &&
      newMetadata.author !== selectedText.author ||
      newMetadata.title !== selectedText.title ||
      newMetadata.is_prose !== selectedText.is_prose ||
      newMetadata.year !== selectedText.year
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
    <Grid container
      alignItems="center"
      justify="center"
      display="flex"
    >
      <Grid item
        md={8}
        xs={12}
      >
        <Paper
          className={classes.root}
        >
          <Grid container
            alignItems="center"
            direction="column"
            justify="center"
            spacing={0}
          >
            <Typography
              align="left"
              className={classes.heading}
              variant="h5"
            >
              Edit Metadata
            </Typography>
            <TextField
              key="author-field"
              onChange={(event) => updateMetadata('author', event.target.value)}
              placeholder="Author"
              required
              value={newMetadata.author}
              variant="outlined"
            />
            <TextField
              key="title-field"
              onChange={(event) => updateMetadata('title', event.target.value)}
              placeholder="Title"
              required
              value={newMetadata.title}
              variant="outlined"
            />
            <TextField
              key="year-field"
              onChange={(event) => updateMetadata('year', event.target.value)}
              placeholder="Year Published"
              type="number"
              value={newMetadata.year}
              variant="outlined"
            />
            <Select
              className={classes.select}
              key="type-field"
              onChange={(event) => updateMetadata('is_prose', event.target.value)}
              placeholder="Text Type"
              renderValue={(value) => value ? 'Prose' : 'Poetry'}
              value={newMetadata.is_prose ? 'Prose' : 'Poetry'}
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
      </Grid>
    </Grid>
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