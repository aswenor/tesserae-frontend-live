/**
 * @fileoverview Row representing one text's metadata and management options.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports CorpusViewerBodyRow
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:react-router-dom
 * @requires NPM:redux
 * @requires NPM:react-redux
 * @requires NPM:lodash
 * @requires NPM:@material-ui/core
 * @requires NPM:@material-ui/icons
 * @requires ./ConfirmDelete
 * @requires ./EditForm
 * @requires ../../state/multitext
 * @requires ../../state/search
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { find } from 'lodash';

import Checkbox from '@material-ui/core/Checkbox';
import Modal from '@material-ui/core/Modal';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';

import { addText, removeText } from '../../state/multitext';
import { clearSourceText, updateSourceText,
         clearTargetText, updateTargetText } from '../../state/search';
import ConfirmDelete from './ConfirmDelete';
import EditForm from './EditForm';


/**
 * Whether or not we are in admin mode.
 */
const MODE = process.env.REACT_APP_MODE.toLowerCase() === 'admin';


/**
 * Row representing one text's metadata and management options.
 * 
 * @component
 * @example
 *  let selections = [];
 *  
 *  let sourceText = {
 *    author: 'vergil',
 *    is_prose: false,
 *    object_id: '89237645fa965',
 *    title: 'aeneid',
 *    year: -25
 *  };
 *  
 *  let targetText = {
 *    author: 'lucan',
 *    is_prose: false,
 *    object_id: 'd76815d1fae4e',
 *    title: 'bellum civile',
 *    year: 65
 *  };
 *  
 *  return (
 *    <CorpusViewerBodyRow
 *      addMultitextSelection={(value) => {selections.push(value)}}
 *      clearMultitextSelection={(value) => {selections.splice(selections.indexOf(value), 1)}}
 *      clearSourceText={() => {sourceText = {};}}
 *      clearTargetText={() => {targetText = {};}}
 *      multitextSelections={selections}
 *      sourceText={sourceText}
 *      targetText={targetText}
 *      text={{
 *        author: 'vergil',
 *        is_prose: false,
 *        object_id: '89237645fa965',
 *        title: 'aeneid',
 *        year: -25
 *      }}
 *      updateSourceText={(value) => sourceText = value;}
 *      updateTargetText={(value) => targetText = value;}
 *    />
 *  );
 */
function CorpusViewerBodyRow(props) {
  const { addMultitextSelection, clearMultitextSelection, clearSourceText,
          clearTargetText, multitextSelections, sourceText, targetText, text,
          updateSourceText, updateTargetText } = props;

  /** Flags determining whether the edit or delete modals is visible. */
  const [ editOpen, setEditOpen ] = useState(false);
  const [ deleteOpen, setDeleteOpen ] = useState(false);

  /**
   * Handle clicking a source or target checkbox.
   * 
   * @param {string} label Either 'source' or 'target'
   * @param {boolean} checked True if the box was checked, false otherwise.
   * @param {Object} value The text to select/deselect.
   */
  const selectText = (label, checked, value) => {
    // Update the selected text. If checked, set the source/target.
    // If unchecked, clear the source/target. If already selected
    // (e.g., target checked but already selected as source), clear
    // from the previous selection (e.g., move from source to target).
    if (label === 'source') {
      if (checked) {
        updateSourceText(value);

        clearMultitextSelection(value);

        if (value.object_id === targetText.object_id) {
          clearTargetText();
        }
      }
      else {
        clearSourceText();
      }
    }
    else if (label === 'target') {
      if (checked) {
        updateTargetText(value);

        clearMultitextSelection(value);

        if (value.object_id === sourceText.object_id) {
          clearSourceText();
        }
      }
      else {
        clearTargetText();
      }
    }
  };

  /**
   * Handle clicking the multitext checkbox.
   * 
   * @param {boolean} checked True if the box was checked, false otherwise.
   * @param {Object} value The text to select/deselect.
   */
  const selectMultitext = (checked, value) => {
    // If multitext was selected, move the text from source/target to the
    // multitext selections list (i.e. a text cannot be source and multitext).
    if (checked) {
      if (value.object_id === sourceText.object_id) {
        clearSourceText();
      }
      
      if (value.object_id === targetText.object_id) {
        clearTargetText();
      }
      
      addMultitextSelection(value);
    }
    else {
      clearMultitextSelection(value);
    }
  };

  
  return (
    <TableRow key={text.object_id}>
      <TableCell
          variant="body"
        >
          <Checkbox
            checked={text.object_id === sourceText.object_id}
            color="primary"
            onChange={(event) => selectText('source', event.target.checked, text)}
            value={text}
          />
        </TableCell>
        <TableCell
          variant="body"
        >
          <Checkbox
            checked={text.object_id === targetText.object_id}
            color="primary"
            onChange={(event) => selectText('target', event.target.checked, text)}
            value={text}
          />
        </TableCell>
        <TableCell
          variant="body"
        >
          <Checkbox
            checked={find(multitextSelections, x => x.object_id === text.object_id) !== undefined}
            color="primary"
            onChange={(event) => selectMultitext(event.target.checked, text)}
            value={text}
          />
        </TableCell>
        <TableCell
          variant="body"
        >
          <Typography variant="body1">{text.author}</Typography>
        </TableCell>
        <TableCell
          variant="body"
        >
          <Typography variant="body1">{text.title}</Typography>
        </TableCell>
        <TableCell
          variant="body"
        >
          <Typography variant="body1">{`${text.year} ${text.year > 0 ? 'CE' : 'BCE'}`}</Typography>
        </TableCell>
        <TableCell
          variant="body"
        >
          <Typography variant="body1">{text.is_prose ? 'Prose' : 'Poetry'}</Typography>
        </TableCell>
        <TableCell
          variant="body"
        >
          <Link to={`/reader/${text.object_id}`}>
            <Tooltip title="View this text" placement="top">
              <LibraryBooksIcon />
            </Tooltip>
          </Link>
        </TableCell>
        {MODE &&
          <TableCell
            variant="body"
          >
            <Tooltip title="Edit metadata" placement="top">
              <EditIcon
                onClick={() => {setDeleteOpen(false); setEditOpen(true)}}
              />
            </Tooltip>
            <EditForm
              closeDialog={() => setEditOpen(false)}
              open={editOpen}
              selectedText={text}
            />
          </TableCell>
        }
        {MODE &&
          <TableCell
            variant="body"
          >
            <Tooltip title="Remove text" placement="top">
              <DeleteForeverIcon
                onClick={() => {setEditOpen(false); setDeleteOpen(true)}}  
              />
            </Tooltip>
            <ConfirmDelete
              closeDialog={() => setDeleteOpen(false)}
              open={deleteOpen}
              selectedText={text}
            />
          </TableCell>
        }
    </TableRow>
  );
}


CorpusViewerBodyRow.propTypes = {
  /**
   * Add a text to the multitext targets list.
   */
  addMultitextSelection: PropTypes.func,

  /**
   * Remove a text from the multitext targets list.
   */
  clearMultitextSelection: PropTypes.func,

  /**
   * Deselect the source text.
   */
  clearSourceText: PropTypes.func,

  /**
   * Deselect the target text.
   */
  clearTargetText: PropTypes.func,

  /**
   * List of multitext targets.
   */
  multitextSelections: PropTypes.arrayOf(
    PropTypes.shape({
      object_id: PropTypes.string
    })
  ),

  /**
   * The selected source text.
   */
  sourceText: PropTypes.shape({
    /**
     * Database id of the source text.
     */
    object_id: PropTypes.string,
  }),

  /**
   * The selected target text.
   */
  targetText: PropTypes.shape({
    /**
     * Database id of the target text.
     */
    object_id: PropTypes.string,
  }),

  /**
   * The text to display in the row.
   */
  text: PropTypes.shape({
    /**
     * Name of the text's author.
     */
    author: PropTypes.string,

    /**
     * True if the text is prose, false if poetry.
     */
    is_prose: PropTypes.bool,

    /**
     * Database id of the text.
     */
    object_id: PropTypes.string,

    /**
     * Title of the text.
     */
    title: PropTypes.string,

    /**
     * Year the text was published.
     */
    year: PropTypes.number
  }),

  /**
   * Set the source text to a new text.
   */
  updateSourceText: PropTypes.func,

  /**
   * Set the target text to a new text.
   */
  updateTargetText: PropTypes.func
};


/**
 * Add redux store state to this component's props.
 * 
 * @param {object} state The global state of the application.
 * @returns {object} Members of the global state to provide as props.
 */
function mapStateToProps(state) {
  return {
    multitextSelections: state.multitext.selectedTexts,
    sourceText: state.search.sourceText,
    targetText: state.search.targetText
  };
}


/**
 * Add redux store actions to this component's props.
 * 
 * @param {function} dispatch The redux dispatch function.
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addMultitextSelection: addText,
    clearMultitextSelection: removeText,
    clearSourceText: clearSourceText,
    clearTargetText: clearTargetText,
    updateSourceText: updateSourceText,
    updateTargetText: updateTargetText
  }, dispatch);
}


// Do redux binding here.
export default connect(mapStateToProps, mapDispatchToProps)(CorpusViewerBodyRow);