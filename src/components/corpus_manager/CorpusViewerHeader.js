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

import IngestForm from './ingest/IngestForm';
import { updatePagination } from '../../state/pagination';


function CorpusViewerHeader(props) {
  const { sortHeader, sortOrder, updatePagination } = props; 

  const [ ingestOpen, setIngestOpen ] = useState(false);

  const handleHeaderClick = newHeader => {
    if (newHeader === sortHeader) {
      updatePagination({sortOrder: -sortOrder});
    }
    else {
      updatePagination({sortHeader: newHeader, sortOrder: -1});
    }
  };

  const headCells = ['Source', 'Target', 'Multitext', 'Author', 'Title', 'Year', 'Genre', ''].map((item, idx) => {
    const order = sortOrder === 1 ? 'asc' : 'desc';
    if ((idx < 2 || idx > 5) && idx !== 7) {
      return (
        <TableCell
          key={item}
          variant="head"
        >
          <Typography><b>{item}</b></Typography>
        </TableCell>
      );
    }
    else if (idx === 7) {
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
          <Modal
            onClose={() => setIngestOpen(false)}
            open={ingestOpen}
          >
            <IngestForm />
          </Modal>
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


function mapStateToProps(state) {
  return {
    sortHeader: state.pagination.sortHeader,
    sortOrder: state.pagination.sortOrder
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updatePagination: updatePagination
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(CorpusViewerHeader);