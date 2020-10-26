import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { differenceBy, isObject, sortBy } from 'lodash'; 

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';

import CorpusFilter from '../common/CorpusFilter';
import MultitextSelectionTableBodyRow from './MultitextSelectionTableBodyRow';
import MultitextSelectionTableHeader from './MultitextSelectionTableHeader';
import TablePaginationActions from '../common/TablePaginationActions';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    height: '100%',
    maxHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      marginLeft: '20%',
      overflow: 'hidden',
      paddingLeft: theme.spacing(3),
      width: '60%'
    },
    [theme.breakpoints.down('sm')]: {
      width: '90%'
    },
  },
  divider: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    width: '10px',
    [theme.breakpoints.up('md')]: {
      float: 'left'
    }
  },
  table: {
    display: 'flex',
    height: '100%',
    margin: 0,
    overflow: "overlay",
    padding: 0,
    width: '100%',
  },
  body: {
    height: '100%'
  }
}));


function filterText(text, filter) {
  let typeFilter = true;
  if (filter.type.toLowerCase() !== 'all') {
    const isProse = filter.type === 'prose';
    typeFilter = isProse === text.is_prose;
  }

  const authorFilter = (
    filter.author === '' ||
    text.author.toLowerCase().search(filter.author) >= 0);
  const titleFilter = (
    filter.title === '' ||
    text.title.toLowerCase().search(filter.title) >= 0);
  const yearFilter = (
    filter.year !== undefined &&
    (text.year >= filter.year[0] || text.year <= filter.year[1])
  );

  return (typeFilter && authorFilter && titleFilter && yearFilter);
}


function sortTexts(textList, page, rows, header, order) {
  const start = Math.max(page * rows, 0);
  const end = Math.min(start + rows, textList.length);

  let out = textList.slice();

  if (header.toLowerCase() === 'author') {
    out = sortBy(sortBy(out, 'title'), 'author');
    
    if (order === -1) {
      out.reverse()
    }
  }
  else if (header.toLowerCase() === 'title') {
    out = sortBy(out, 'header');

    if (order === -1) {
      out.reverse()
    }
  }

  return out.slice(start, end);
}


function MultitextSelectionTable(props) {
  const { closeModal, textList } = props;

  console.log('textlist', textList)
        
  const classes = useStyles();
  
  const [ filter, setFilter ] = useState({
    type: 'all',
    author: '',
    title: '',
    year: [-10000000, 100000000]
  });

  const [ pagination, setPagination ] = useState({
    currentPage: 0,
    rowsPerPage: 10,
    sortHeader: 'author',
    sortOrder: 1,
  });

  const onChangePage = (event, page) => {
    setPagination(prev => ({...prev, currentPage: page}));
  }

  const onChangeRowsPerPage = (event) => {
    setPagination(prev => (
      {...prev, currentPage: 0, rowsPerPage: event.target.value}));
  }

  const bodyRows = sortTexts(
      textList.filter(item => filterText, filter), 
      pagination.currentPage,
      pagination.rowsPerPage,
      pagination.sortHeader,
      pagination.sortOrder)
    .map(item => {
    return (
      <MultitextSelectionTableBodyRow
        text={item}
      />
    );
  });

  return (
    <Paper
      className={classes.root}
    >
      <Toolbar>
        <Box
          alignContent="center"
          alignItems="center"
          justifyContent="center"
          justifyItems="center"
          width={0.99}
        >
          <Typography align="center" variant="h4">
            Select Multitext Targets
          </Typography>
        </Box>
        <Box
          alignContent="center"
          alignItems="center"
          justifyContent="center"
          justifyItems="center"
          width={0.01}
        >
          <CloseIcon
            onClick={closeModal}
          />
        </Box>
      </Toolbar>
      <Grid container
        alignContent="flex-start"
        alignItems="flex-start"
        justify="center"
        spacing={2}
        styles={{overflow: 'hidden'}}
      >
        <Grid item md={4} xs={12}>
          <CorpusFilter
            authorFilter={filter.author}
            dateRangeFilter={filter.year}
            setAuthorFilter={(value) => setFilter(prev => ({...prev, author: isObject(value) ? value.author : value}))}
            setDateRangeFilter={(value) => setFilter(prev => ({...prev, year: value}))}
            setTitleFilter={(value) => setFilter(prev => ({...prev, title: isObject(value) ? value.title : value}))}
            setTypeFilter={(value) => setFilter(prev => ({...prev, type: value}))}
            titleFilter={filter.title}
            typeFilter={filter.type}
          />
        </Grid>
        <Grid item md={1}>
          <Divider
            className={classes.divider}
            orientation="vertical"
          />
        </Grid>
        <Grid item md={7} xs={12}
          styles={{overflow: 'hidden'}}
        >
          <Box
            alignContent="flex-start"
            alignItems="flex-start"
            justifyContent="flex-start"
            justifyItems="flewx-start"
            display="flex"
            flexDirection="column"
            m={0}
            width={1}
          >
            <TableContainer
              className={classes.root}
            >
              <Table
                stickyHeader
              >
                <TableHead>
                  <MultitextSelectionTableHeader
                    setPagination={setPagination}
                    sortHeader={pagination.sortHeader}
                    sortOrder={pagination.sortOrder}
                  />
                </TableHead>
                <TableBody
                  className={classes.body}
                >
                  {bodyRows}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              ActionsComponent={TablePaginationActions}
              className={classes.root}
              count={textList.length}
              labelRowsPerPage="Rows per page:"
              onChangePage={onChangePage}
              onChangeRowsPerPage={onChangeRowsPerPage}
              page={pagination.currentPage}
              rowsPerPage={pagination.rowsPerPage}
              rowsPerPageOptions={[10, 25, 50, 100]}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}


MultitextSelectionTable.propTypes = {
  textList: PropTypes.arrayOf(
    PropTypes.shape({
      author: PropTypes.string,
      object_id: PropTypes.string,
      title: PropTypes.string
    })
  ),
}


function mapStateToProps(state) {
  const textList = differenceBy(
    state.corpus.availableTexts,
    [state.search.sourceText, state.search.targetText],
    'object_id')
  
  return {
    currentPage: state.pagination.currentPage,
    rowsPerPage: state.pagination.rowsPerPage,
    sortHeader: state.pagination.sortHeader,
    sortOrder: state.pagination.sortOrder,
    textList: textList
  }
}


export default connect(mapStateToProps)(MultitextSelectionTable);