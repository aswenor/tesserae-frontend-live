import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';

import { fetchTexts } from '../../api/corpus';
import { clearSourceText, updateSourceText,
         clearTargetText, updateTargetText } from '../../state/search';
import TablePaginationActions from '../common/TablePaginationActions';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    maxHeight: '75%',
    padding: theme.spacing(4)
  },
  paper: {
    backgroundColor: theme.palette.secondary.main,
    maxHeight: '75%',
    margin: theme.spacing(4),
    padding: theme.spacing(4),
    width: '100%'
  },
  table: {
    maxHeight: '75%'
  },
  tableBody: {
    overflowY: 'scroll'
  }
}));


function CorpusViewer(props) {
  const { asyncReady, availableTexts, clearSourceText, clearTargetText,
          fetchTexts, language, sourceText, targetText, updateSourceText,
          updateTargetText } = props;

  const classes = useStyles();
  
  const [ paging, setPaging] = useState({
    currentPage: 0,
    rowsPerPage: 10,
    sortHeader: 'author',
    sortOrder: 1
  });

  if (language !== '' && availableTexts.length === 0) {
    fetchTexts(language, asyncReady);
  }

  const handlePagingUpdate = (label, value) => {
    // Create a new paging object by copying the old and overwriting
    // the updated field.
    let newPaging = {...paging, [label]: value};
    
    // If the sort header was submitted but has not changed, change
    // the sort direction.
    if (label === 'sortHeader' && value === paging.sortHeader) {
      newPaging.sortOrder = -paging.sortOrder;
    }

    // If anything other than the current page was changed,
    // go to the new first page.
    if (label !== 'currentPage') {
      newPaging.currentPage = 0;
    }

    setPaging(newPaging);
  };

  const selectText = (label, checked, value) => {
    console.log(checked);
    // Update the selected text. If checked, set the source/target.
    // If unchecked, clear the source/target. If already selected
    // (e.g., target checked but already selected as source), clear
    // from the previous selection (e.g., move from source to target).
    if (label === 'source') {
      if (checked) {
        updateSourceText(value);
       
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
       
        if (value.object_id === sourceText.object_id) {
          clearSourceText();
        }
      }
      else {
        clearTargetText();
      }
    }
  };

  const start = paging.currentPage * paging.rowsPerPage;
  const end = start + paging.rowsPerPage;

  const headCells = ['Source', 'Target', 'Author', 'Title', 'Year', 'Genre'].map((item, idx) => {
    if (idx < 2) {
      return (
        <TableCell
          key={item}
          variant="head"
        >
          <Typography><b>{item}</b></Typography>
        </TableCell>
      );
    }
    else {
      return (
        <TableCell
          key={item}
          variant="head"
          sortDirection={paging.sortHeader === item ? paging.sortOrder : false}
        >
          <TableSortLabel
            active={paging.sortHeader === item}
            direction={paging.sortHeader === item
                       ? (paging.sortOrder === 1 ? 'asc' : 'desc')
                       : 'asc'
            }
            onClick={() => handlePagingUpdate('sortHeader', item)}
          >  
            <Typography><b>{item}</b></Typography>
          </TableSortLabel>
        </TableCell>
      );
    }
  });

  const bodyCells = availableTexts.sort(
    x => x[paging.sortHeader]
  ).slice(
    start, end
  ).map( item => {
    console.log();
    return (
      <TableRow
        key={item.object_id}
      >
        <TableCell
          variant="body"
        >
          <Checkbox
            checked={item.object_id === sourceText.object_id}
            color="primary"
            onChange={(event) => selectText('source', event.target.checked, item)}
            value={item}
          />
        </TableCell>
        <TableCell
          variant="body"
        >
          <Checkbox
            checked={item.object_id === targetText.object_id}
            color="primary"
            onChange={(event) => selectText('target', event.target.checked, item)}
            value={item}
          />
        </TableCell>
        <TableCell
          variant="body"
        >
          <Typography variant="body1">{item.author}</Typography>
        </TableCell>
        <TableCell
          variant="body"
        >
          <Typography variant="body1">{item.title}</Typography>
        </TableCell>
        <TableCell
          variant="body"
        >
          <Typography variant="body1">{`${item.year} ${item.year > 0 ? 'CE' : 'BCE'}`}</Typography>
        </TableCell>
        <TableCell
          variant="body"
        >
          <Typography variant="body1">{item.is_prose ? 'Prose' : 'Poem'}</Typography>
        </TableCell>
      </TableRow>
    );
  });

  return (
    <Grid container
      alignItems="center"
      justify="center"
    >
      <Paper
        className={classes.paper}
      >
        <TableContainer
          className={classes.table}
        >
          <Table
            stickyheader
          >
            <TableHead>
              <TableRow>
                {headCells}
              </TableRow>
            </TableHead>
            <TableBody
              className={classes.tableBody}
            >
              {bodyCells}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          ActionsComponent={TablePaginationActions}
          count={availableTexts.length}
          page={paging.currentPage}
          onChangePage={handlePagingUpdate}
          onChangeRowsPerPage={(event) => {handlePagingUpdate('rowsPerPage', event.target.value)}}
          rowsPerPage={paging.rowsPerPage}
        />
      </Paper>
    </Grid>
  );
}


CorpusViewer.propTypes = {

};


function mapStateToProps(state) {
  return {
    asyncReady: state.async.asyncPending < state.async.maxAsyncPending,
    availableTexts: state.corpus.availableTexts,
    language: state.corpus.language,
    sourceText: state.search.sourceText,
    targetText: state.search.targetText
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    clearSourceText: clearSourceText,
    clearTargetText: clearTargetText,
    fetchTexts: fetchTexts,
    updateSourceText: updateSourceText,
    updateTargetText: updateTargetText
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(CorpusViewer);