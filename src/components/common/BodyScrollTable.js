import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
// import DataGrid from '@material-ui/data-grid';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody'
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';

import TesseraeTablePagination from './TesseraeTablePagination';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '100%',
    margin: 0,
    // overflow: "overlay",
    padding: 0,
    width: '100%',
  },
  container: {
    height: '100%',
    // overflow: 'overlay'
  },
  body: {
    marginBottom: '300px',
    // height: '98%',
    overflow: 'overlay'
  },
  pagination: {
    backgroundColor: 'white',
    borderTop: '1px solid #dedede',
    bottom: 0,
    minHeight: '52px',
    position: 'fixed',
    top: 'auto',
    width: '100%',
    zIndex: theme.zIndex.drawer
  }
}));


function BodyScrollTable(props) {
  const { bodyCount, bodyRows, headerRow, initialRowsPerPage, onPageChange,
          rowsPerPageLabel, rowsPerPageOptions } = props;

  const classes = useStyles();
  
  return (
    <Box
      alignContent="flex-start"
      alignItems="flex-start"
      className={classes.root}
      justifyContent="flex-start"
      justifyItems="flex-start"
      display="flex"
      flexDirection="column"
      m={0}
      p={0}
      width={1}
    >
      <Box
        height={'100%'}
        width={1}
      >
        <TableContainer className={classes.container}>
          <Table
            stickyHeader
          >
            <TableHead>
              {headerRow}
            </TableHead>
            <TableBody
              className={classes.body}
            >
              {bodyRows}
            </TableBody>

          </Table>
        </TableContainer>
      </Box>
      <Box
        className={classes.pagination}
      >
        <TesseraeTablePagination
          count={bodyCount}
          initialRowsPerPage={initialRowsPerPage}
          onPageChange={onPageChange}
          rowsPerPageLabel={rowsPerPageLabel}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      </Box>
    </Box>
  );
}


BodyScrollTable.propTypes = {
  bodyCount: PropTypes.number,
  bodyRows: PropTypes.arrayOf(PropTypes.element),
  headerRow: PropTypes.element,
  onPageChange: PropTypes.func,
  rowsPerPageLabel: PropTypes.string,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number)
};


export default BodyScrollTable;