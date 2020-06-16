import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import { fetchTexts } from '../../api/corpus';


function LibraryTable(props) {
  const { asyncPending, availableTexts, fetchTexts, language } = props;
  
  const [ sortLabel, setSortLabel ] = useState('Author');
  const [ sortOrder, setSortOrder ] = useState(1);
  const [ currentPage, setCurrentPage ] = useState(0);
  const [ rowsPerPage, setRowsPerPage ] = useState(100);

  console.log(availableTexts, language);
  if (availableTexts.length === 0 && language !== '') {
    console.log('Fetching')
    fetchTexts(language, !asyncPending);
  }

  const header = ['Author', 'Title'].map(item => {
    const selected = sortLabel === item;
    const order = sortOrder === 1 ? 'asc' : 'desc';
    
    return (
      <TableCell
        align="center"
        key={item}
        sortDirection={selected ? order : false}
      >
        <TableSortLabel
          active
          direction={sortLabel === item ? order : 'asc'}
          onClick={() => setSortOrder(prevSortOrder => -prevSortOrder)}
        >
          {item}
        </TableSortLabel>
      </TableCell>
    );
  });

  const body = availableTexts.map(item => (
    <TableRow>
      <TableCell>
        {item.author}
      </TableCell>
      <TableCell>
        {item.title}
      </TableCell>
    </TableRow>
  ));

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {header}
            </TableRow>
          </TableHead>
          <TableBody>
            {body}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        count={availableTexts.length}
        onChangePage={(event, value) => setCurrentPage(value)}
        onChangeRowsPerPage={(event) => setRowsPerPage(event.target.value)}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[25, 50, 100, 200]}
      />
    </div>
  );
}


const mapStateToProps = state => ({
  asyncPending: state.asyncPending,
  availableTexts: state.availableTexts,
  language: state.language
});


const mapDispatchToProps = dispatch => bindActionCreators({
  fetchTexts: fetchTexts,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(LibraryTable);