import React from 'react';
import PropTypes from 'prop-types';
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
  constructor(props) {
    super(props);
    this.state = {
      textList: [],
      selectedAuthor: '',
      selectedText: ''
    };
  }

  componentDidMount() {
    const { language } = this.props;
    this.setState({ textList: loadTextMetadata(language) });
  }

  handleAuthorChange = value => {
    this.setState({ selectedAuthor: value.value });
  }

  handleTextChange = value => {
    this.setState({ selectedText: value.value });
  }

  render() {
    const { title } = this.props;
    const { selectedAuthor, selectedText, textList } = this.state;

    const authorItems = textList.map(t => t.author)
                                .filter((v, i, self) => self.indexOf(v) === i)
                                .map(v => {return {label: v, value: v}});
  
    const textItems = textList.filter(t => t.author === selectedAuthor)
                              .map(t => { return {label: t.title, value: t.title}});
    
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
          onChange={this.handleAuthorChange}
          options={authorItems}
          placeholder="Select an Author"
          value={selectedAuthor}
        />
        <SearchableDropdown
          isClearable
          onChange={this.handleTextChange}
          options={textItems}
          placeholder="Select a Text"
          value={selectedText}
        />
      </div>
    );
  }
}


TextSelectGroup.propTypes = {
  title: PropTypes.string
}


export default TextSelectGroup;
