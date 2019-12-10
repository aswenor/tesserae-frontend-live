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

  handleAuthorChange = event => {
    this.setState({ selectedAuthor: event.target.innerText });
  }

  handleTextChange = event => {
    const textName = event.target.innerText.toLowerCase()
    const text = this.state.textList.filter(t => t.title.toLowerCase() === textName);
    console.log(text[0].author)
    this.setState({
      selectedAuthor: {label: text[0].author, value: text[0].author},
      selectedText: {label: textName, value: textName}
    });
  }

  render() {
    const { title } = this.props;
    const { selectedAuthor, selectedText, textList } = this.state;

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
