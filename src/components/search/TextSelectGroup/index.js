import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import MenuItem from '@material-ui/core/MenuItem';
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
  const { handleAuthorChange, handleTextChange, index,
          selectedAuthor, selectedText, textList, title } = this.props;
  const classes = useStyles();

  const authorItems = textList.map(t => t.author.toLowerCase())
                              .filter((v, i, self) => self.indexOf(v) === i)
                              .map(v => {return {label: v, value: v}})
                              .sort((a, b) => b.label < a.label);

  const textItems = textList.filter(t => selectedAuthor === '' || t.author.toLowerCase() === selectedAuthor)
                            .map(t => { return {label: t.title, value: t.title}})
                            .sort((a, b) => b.label < a.label);

  return (
    <div>
      <Typography
        align="left"
        variant="h5"
      >
        {title}
      </Typography>
      <SearchableDropdown
        isClearable
        onChange={handleAuthorChange}
        options={authorItems}
        placeholder="Select an Author"
        value={selectedAuthor}
      />
      <SearchableDropdown
        isClearable
        onChange={handleTextChange}
        options={textItems}
        placeholder="Select a Text"
        value={selectedText}
      />
    </div>
  );
}


export default TextSelectGroup;
