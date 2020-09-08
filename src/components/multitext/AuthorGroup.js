/**
 * @fileoverview Group texts by author in a tree view.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:redux
 * @requires NPM:react-redux
 * @requires NPM:lodash
 * @requires NPM:@material-ui/core
 * @requires NPM:@material-ui/lab
 * @requires ../../state/multitext
 */
import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { find, findIndex } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';

import { addText, removeText } from '../../state/multitext';


/** CSS styles to apply to the author/title dropdowns. */
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  }
}));


/**
 * Tree view of a single author's texts by title.
 * 
 * @component
 */
function AuthorGroup(props) {
  const { author, deselectText, selectText, selectedTexts, textList } = props;

  const classes = useStyles();

  /**
   * Add or remove a text from multitext search on check.
   * 
   * @param {Event} event The browser event fired by the checkbox.
   */
  const handleCheck = event => {
    // This prevents the parent TreeView object from closing the tree.
    event.preventDefault();

    const checked = event.target.checked;
    const value = event.target.value;
    
    // The checkbox casts its value to string, so instead of directly storing
    // getting the text object it is looked up from `textList` by object id.
    const text = find(textList, x => x.object_id === value);
    
    // If the checkbox was checked, add the text, otherwise remove.
    if (checked) {
      console.log('selecting text');
      selectText(text);
    }
    else {
      deselectText(text);
    }
  }

  return (
    <TreeItem
      className={classes.root}
      key={author}
      label={author}
      nodeId={author}
    >
      {textList.map(item => {
        return (
          <TreeItem
            key={item.object_id}
            label={
              <div
                onClick={handleCheck}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <Checkbox
                  checked={findIndex(selectedTexts, x => x.object_id === item.object_id) >= 0}
                  color="primary"
                  id={`checkbox-${item.object_id}`}
                  onChange={handleCheck}
                  value={item.object_id}
                />
                <Typography
                  variant="caption"
                >
                  {item.title}
                </Typography>
              </div>
            }
            nodeId={item.object_id}
          />
        );
      })}
    </TreeItem>
  );
}


AuthorGroup.propTypes = {
  /**
   * The author of the texts in this group.
   */
  author: PropTypes.string,
  
  /**
   * Callback to deselect a text from multitext search. 
   */
  deselectText: PropTypes.func,

  /**
   * Callback to select a text for multitext search. 
   */
  selectText: PropTypes.func,

  /**
   * List of texts by this author selected for multitext search.
   */
  selectedTexts: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * Database id of the text.
       */
      object_id: PropTypes.string
    })
  ),

  /**
   * List of available texts by this author.
   */
  textList: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * Database id of the text.
       */
      object_id: PropTypes.string
    })
  )
}


/**
 * Add redux store state to this component's props.
 * 
 * @param {object} state The global state of the application.
 * @returns {object} Members of the global state to provide as props.
 */
function mapStateToProps(state) {
  return {};
}


/**
 * Add redux store actions to this component's props.
 * 
 * @param {function} dispatch The redux dispatch function.
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    deselectText: removeText,
    selectText: addText
  }, dispatch);
}


// Do redux binding here.
export default connect(mapStateToProps, mapDispatchToProps)(AuthorGroup);