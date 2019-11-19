import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import MenuItem from '@material-ui/core/MenuItem';

import SearchableDropdown from '../../common/SearchableDropdown';


const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


class TextSelectGroup extends React.Component {
  render() {
    const classes = useStyles();

    const authorList = authors.map(author => {
      return <MenuItem value={author}>{author}</MenuItem>
    });

    const textList = texts.map(text => {
      return <MenuItem value={text}>{text}</MenuItem>
    });

    return (
      <div>
        <SearchableDropdown
          isClearable
          onChange={this.props.onChange}
          placeholder="Select an Author"
          value={this.props.authors[this.props.position]}
        >
          { ...authorList }
        </SearchableDropdown>
        <SearchableDropdown
          isClearable
          onChange={this.props.onChange}
          placeholder="Select a Text"
          value={this.props.texts[this.props.position]}
        >
          { ...textList }
        </SearchableDropdown>
      </div>
    );
  }
}


export default TextSelectGoup;
