/**
 * @fileoverview Header columns with a button to ingest a text.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports CorpusViewerHeader
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:react-redux
 * @requires NPM:react-router-dom
 * @requires NPM:@material-ui/core
 * @requires NPM:@material-ui/icons
 * @requires ./IngestForm
 * @requires ../../state/pagination
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Fab from '@material-ui/core/Fab';
import Modal from '@material-ui/core/Modal';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';

import IngestForm from './IngestForm';
import { updatePagination } from '../../state/pagination';


/**
 * Whether or not we are in admin mode.
 */
const MODE = process.env.REACT_APP_MODE.toLowerCase() === 'admin';


/**
 * Header columns with a button to ingest a text.
 * 
 * @component
 * @example
 *  return (
 *    <CorpusViewerHeader
 *      sortHeader="author"
 *      sortOrder={1}
 *      updatePagination={(value) => {}}
 *    />
 *  );
 */
function CorpusViewerHeader(props) {
  const { sortHeader, sortOrder, updatePagination } = props; 

  /** Flag indicating that the ingest form should be visible. */
  const [ ingestOpen, setIngestOpen ] = useState(false);

  /**
   * Update pagination on header click.
   * 
   * @param {string} newHeader The column that was clicked.
   */
  const handleHeaderClick = newHeader => {
    // If the header did not change, update the sort order.
    // Otherwise update the header and set the order to ascending. 
    if (newHeader === sortHeader) {
      updatePagination({sortOrder: -sortOrder});
    }
    else {
      updatePagination({sortHeader: newHeader, sortOrder: 1});
    }
  };

  /** The header cells. Some are sortable and others are not. */
  const headCells = ['Source', 'Target', 'Multitext', 'Author', 'Title', 'Year', 'Genre', ''].map((item, idx) => {
    const order = sortOrder === 1 ? 'asc' : 'desc';
    // If not sortable, create a standard cell.
    // If sortable, create a sortable cell.
    // If at the end of the row, create the ingest button.
    if ((idx < 3 || idx > 5) && idx !== 7) {
      return (
        <TableCell
          key={item}
          variant="head"
        >
          <Typography><b>{item}</b></Typography>
        </TableCell>
      );
    }
    else if (MODE && idx === 7) {
      return (
        <TableCell
          align="right"
          colSpan={3}
          key={item}
          variant="head"
        >
          <Fab
            onClick={() => setIngestOpen(true)}
            variant="extended"
          >
            <AddIcon /> Add A Text
          </Fab>
          <IngestForm
            closeDialog={() => setIngestOpen(false)}
            open={ingestOpen}
          />
        </TableCell>
      );
    }
    else {
      return (
        <TableCell
          key={item}
          variant="head"
          sortDirection={sortHeader === item ? order : false}
        >
          <TableSortLabel
            active={sortHeader === item}
            direction={sortHeader === item
                       ? (sortOrder === 1 ? 'asc' : 'desc')
                       : 'asc'
            }
            onClick={() => handleHeaderClick(item.toLowerCase())}
          >  
            <Typography><b>{item}</b></Typography>
          </TableSortLabel>
        </TableCell>
      );
    }
  });

  return (
    <TableRow>
      {headCells}
    </TableRow>
  );
}


CorpusViewerHeader.propTypes = {
  /**
   * The header text of the column to sort by.
   */
  sortHeader: PropTypes.string,

  /**
   * 1 for ascending, -1 for descending.
   */
  sortOrder: PropTypes.number,

  /**
   * Function to update the sort header and order.
   */
  updatePagination: PropTypes.func
};


/**
 * Add redux store state to this component's props.
 * 
 * @param {object} state The global state of the application.
 * @returns {object} Members of the global state to provide as props.
 */
function mapStateToProps(state) {
  return {
    sortHeader: state.pagination.sortHeader,
    sortOrder: state.pagination.sortOrder
  };
}


/**
 * Add redux store actions to this component's props.
 * @param {function} dispatch The redux dispatch function.
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updatePagination: updatePagination
  }, dispatch);
}


// Do redux binding here.
export default connect(mapStateToProps, mapDispatchToProps)(CorpusViewerHeader);