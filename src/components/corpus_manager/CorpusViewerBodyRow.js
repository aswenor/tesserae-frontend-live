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


function CorpusViewerBodyRow(props) {
  const { addMultitextSelection, clearMultitextSelection, clearSourceText,
          clearTargetText, multitextSelections, sourceText, targetText, text,
          updateSourceText, updateTargetText } = props;

  const [ editOpen, setEditOpen ] = useState(false);
  const [ deleteOpen, setDeleteOpen ] = useState(false);

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

  const selectMultitext = (checked, value) => {
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
        <TableCell
          variant="body"
        >
          <Tooltip title="Edit metadata" placement="top">
            <EditIcon
              onClick={() => {setDeleteOpen(false); setEditOpen(true)}}
            />
          </Tooltip>
          <Modal
            aria-describedby="edit-text-metadata"
            aria-labelledby="edit-text-modal"
            onClose={() => setEditOpen(false)}
            open={editOpen}
          >
            <EditForm selectedText={text} />
          </Modal>
        </TableCell>
        <TableCell
          variant="body"
        >
          <Tooltip title="Remove text" placement="top">
            <DeleteForeverIcon
              onClick={() => {setEditOpen(false); setDeleteOpen(true)}}  
            />
          </Tooltip>
          <Modal
            aria-describedby="remove-text-from-corpus"
            aria-labelledby="remove-text-modal"
            onClose={() => setDeleteOpen(false)}
            open={deleteOpen}
          >
            <ConfirmDelete
              closeModal={() => setDeleteOpen(false)}
              selectedText={text}
            />
          </Modal>
        </TableCell>
    </TableRow>
  );
}


CorpusViewerBodyRow.propTypes = {
  addMultitextSelection: PropTypes.func,
  clearMultitextSelection: PropTypes.func,
  clearSourceText: PropTypes.func,
  clearTargetText: PropTypes.func,
  multitextSelections: PropTypes.arrayOf(
    PropTypes.shape({
      object_id: PropTypes.string
    })
  ),
  sourceText: PropTypes.shape({
    object_id: PropTypes.string,
  }),
  targetText: PropTypes.shape({
    object_id: PropTypes.string,
  }),
  text: PropTypes.shape({
    author: PropTypes.string,
    is_prose: PropTypes.bool,
    object_id: PropTypes.string,
    title: PropTypes.string,
    year: PropTypes.number
  }),
  updateSourceText: PropTypes.func,
  updateTargetText: PropTypes.func
};


function mapStateToProps(state) {
  return {
    multitextSelections: state.multitext.selectedTexts,
    sourceText: state.search.sourceText,
    targetText: state.search.targetText
  };
}


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


export default connect(mapStateToProps, mapDispatchToProps)(CorpusViewerBodyRow);