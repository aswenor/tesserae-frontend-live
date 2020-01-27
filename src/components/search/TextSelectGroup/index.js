import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import uniqBy from 'lodash/uniqBy';

import Autocomplete from '@material-ui/lab/Autocomplete';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import SearchableDropdown from '../../common/SearchableDropdown';

import { loadTextMetadata } from '../../../api/corpus';


const useStyles = makeStyles({
  formControl: {
    minWidth: 120,
  },
  selectEmpty: {
  }
});


function TextSelectGroup(props) {
  const { handleTextChange, index,
          loading, selection, textList, title } = props;
  const classes = useStyles();

  const selectedAuthor = selection.author ? selection.author : '';
  const selectedText = selection.title ? selection.title : '';

  const authorItems = uniqBy(textList, 'author');

  const textItems = textList.filter(t => selectedAuthor === '' || t.author.toLowerCase() === selectedAuthor);

  return (
    <div>
      <Typography
        align="left"
        variant="h5"
      >
        {title}
      </Typography>
      <Autocomplete
        getOptionLabel={option => {console.log(option); return option.author;}}
        onInputChange={handleTextChange}
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
        getOptionLabel={option => option.title}
        onChange={handleTextChange}
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
      {/* <SearchableDropdown
        getOptionLabel={option => option.author}
        isClearable
        onChange={handleTextChange}
        options={authorItems}
        placeholder="Select an Author"
        value={selectedAuthor}
        />
        <SearchableDropdown
        getOptionLabel={option => option.title}
        isClearable
        onChange={handleTextChange}
        options={textItems}
        placeholder="Select a Text"
        value={selectedText}
      /> */}
    </div>
  );
}


export default TextSelectGroup;
