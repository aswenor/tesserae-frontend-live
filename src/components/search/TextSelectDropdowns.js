/**
 * @fileoverview Dropdown menus for selecting authors and texts to search.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports TextSelectGroup
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:lodash
 * @requires NPM:@material-ui/core
 */
import React from 'react';
import PropTypes from 'prop-types';
import { isFunction, isNull, uniqBy } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';


/** CSS styles to apply to the component. */
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  heading: {
    marginBottom: '10px'
  },
  select: {
    backgroundColor: theme.palette.default.main,
    marginBottom: '10px',
    [theme.breakpoints.up('md')]: {

    },
    [theme.breakpoints.down('sm')]: {

    }
  }
}));


/**
 * Aligned searchable dropdown menus for selecting author and text.
 * 
 * @component
 * 
 * @example
 *   const handleTextChange = (event) => event;
 *   const onOpen = (event) => event;
 *   const selection = {author: 'lucan', title: 'bellum civile'};
 *   const textList = [
 *     {author: 'lucan', title: 'bellum civile'},
 *     {author: 'vergil', title: 'aeneid'}
 *   ];
 *   return (
 *     <TextSelectGroup
 *        handleTextChange={handleTextChange}
 *        loading={false}
 *        loadingText="Loading text list..."
 *        onOpen={onOpen}
 *        selection={selection}
 *        textList={textList}
 *        title="Source Text"
 *     />
 *   )
 */
function TextSelectDropdowns(props) {
  const { handleAuthorChange, handleTitleChange, loading, loadingText,
          onOpen, selection, textList, title } = props;

  /** CSS styles and global theme. */
  const classes = useStyles();

  /** Text list to select author, the first text in the list by each author. */
  const authorItems = uniqBy(textList, 'author').sort((a, b) => a.author > b.author);

  /** Text list to select title, filtered by author when an author is selected. */
  const textItems = textList.filter(t => selection.author === '' || t.author.toLowerCase() === selection.author).sort((a, b) => a.title > b.title);

  return (
    <div>
      { title !== '' &&
        <Typography
          align="left"
          className={classes.heading}
          variant="h5"
        >
          {title}
        </Typography>
      }
      <Autocomplete
        className={classes.select}
        defaultValue={{author: '', title: ''}}
        getOptionLabel={option => option.author !== undefined ? option.author : ''}
        loading={loading}
        loadingText={loadingText}
        onChange={(event, value) => handleAuthorChange(!isNull(value) ? value : '')}
        // onInputChange={(event, value) => handleAuthorChange(!isNull(value) ? value : '')}
        onOpen={(event) => {onOpen()}}
        options={authorItems}
        renderInput={params => (
          <TextField {...params}
            fullWidth
            placeholder={"Select an Author"}
            variant="outlined"
          />
        )}
        value={selection}
      />
      <Autocomplete
        className={classes.select}
        defaultValue={{author: '', title: ''}}
        getOptionLabel={option => option.title !== undefined ? option.title : ''}
        loading={loading}
        loadingText={loadingText}
        onChange={(event, value) => handleTitleChange(!isNull(value) ? value : '')}
        // onInputChange={(event, value) => handleTitleChange(!isNull(value) ? value : '')}
        onOpen={(event) => {onOpen()}}
        options={textItems}
        renderInput={params => (
          <TextField {...params}
            fullWidth
            placeholder={"Select a Text"}
            variant="outlined"
          />
        )}
        value={selection}
      />
    </div>
  );
}


TextSelectDropdowns.propTypes = {
  /**
   * Callback to handle selecting a text in either dropdown.
   */
  handleTextChange: PropTypes.func,

  /**
   * Indicates whether or not the texts are loading from the REST API.
   */
  loading: PropTypes.bool,

  /**
   * Text to display when the texts are loading from the REST API.
   */
  loadingText: PropTypes.string,

  /**
   * Callback to handle opening either dropdown, e.g. kicking off loading texts.
   */
  onOpen: PropTypes.func,

  /**
   * The current selection, propagated over both dropdowns.
   */
  selection: PropTypes.object,

  /**
   * List of texts to distribute over both dropdowns.
   */
  textList: PropTypes.arrayOf(PropTypes.object),

  /**
   * Text to display describing the purpose of these dropdowns.
   */
  title: PropTypes.string
}


export default TextSelectDropdowns;
