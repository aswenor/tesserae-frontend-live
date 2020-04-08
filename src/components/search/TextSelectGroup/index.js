import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import uniqBy from 'lodash/uniqBy';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  heading: {
    marginBottom: '10px'
  },
  select: {
    marginBottom: '10px',
    [theme.breakpoints.up('md')]: {

    },
    [theme.breakpoints.down('sm')]: {

    }
  }
}));


function TextSelectGroup(props) {
  const { handleTextChange, loading, loadingText, onOpen,
          selection, textList, title } = props;
  const classes = useStyles();

  const authorItems = uniqBy(textList, 'author').sort((a, b) => a.author > b.author);
  const textItems = textList.filter(t => selection.author === '' || t.author.toLowerCase() === selection.author).sort((a, b) => a.title > b.title);

  return (
    <div>
      <Typography
        align="left"
        className={classes.heading}
        variant="h5"
      >
        {title}
      </Typography>
      <Autocomplete
        className={classes.select}
        defaultValue={{author: '', title: ''}}
        getOptionLabel={option => option.author !== undefined ? option.author : option}
        loading={loading}
        loadingText={loadingText}
        onChange={handleTextChange}
        onOpen={onOpen}
        options={authorItems}
        renderInput={params => (
          <TextField {...params}
            label={"Select an Author"}
            variant="outlined"
            fullWidth
          />
        )}
        value={selection}
      />
      <Autocomplete
        className={classes.select}
        defaultValue={{author: '', title: ''}}
        getOptionLabel={option => option.title !== undefined ? option.title : option}
        loading={loading}
        loadingText={loadingText}
        onChange={handleTextChange}
        onOpen={onOpen}
        options={textItems}
        renderInput={params => (
          <TextField {...params}
            label={"Select a Text"}
            variant="outlined"
            fullWidth
          />
        )}
        value={selection}
      />
    </div>
  );
}


export default TextSelectGroup;
