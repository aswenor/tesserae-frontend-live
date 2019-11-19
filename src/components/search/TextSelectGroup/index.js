import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

import SearchableDropdown from '../../common/SearchableDropdown';

import { loadTextMetadata } from '../../../api/corpus';


// const useStyles = makeStyles( (theme) => ({
//   formControl: {
//     margin: theme.spacing(1),
//     minWidth: 120,
//   },
//   selectEmpty: {
//     marginTop: theme.spacing(2),
//   }
// }));


class TextSelectGroup extends React.Component {
  state = {
    author: '',
    text: '',
    texts: []
  }

  componentDidMount() {
    const texts = loadTextMetadata(this.props.language);
    this.setState({ texts: [ ...texts ] });
  }

  render() {
    const { author, text, texts } = this.state;
    // const classes = useStyles();

    const authorList = texts.map(text => {
      return <MenuItem value={text.author}>{text.author}</MenuItem>
    });

    const textList = texts.map(text => {
      return <MenuItem value={text.title}>{text.title}</MenuItem>
    });

    return (
      <div>
        <Typography
          align="left"
          variant="h5"
        >
          {this.props.title}
        </Typography>
        <SearchableDropdown
          isClearable
          onChange={this.props.onChange}
          placeholder="Select an Author"
          value={author}
        >
          ...authorList
        </SearchableDropdown>
        <SearchableDropdown
          isClearable
          onChange={this.props.onChange}
          placeholder="Select a Text"
          value={text}
        >
          ...textList
        </SearchableDropdown>
      </div>
    );
  }
}


export default TextSelectGroup;
