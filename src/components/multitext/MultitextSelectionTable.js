import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { differenceBy, isObject, sortBy } from 'lodash'; 

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Box from '@material-ui/core/Box';
import DataGrid from '@material-ui/data-grid';
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
import HorizontalResizePanels from '../common/HorizontalResizePanels';
import MultitextSelectionTableBodyRow from './MultitextSelectionTableBodyRow';
import MultitextSelectionTableHeader from './MultitextSelectionTableHeader';
import TablePaginationActions from '../common/TablePaginationActions';
import ThemedDialog from '../common/ThemedDialog';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    maxHeight: '80vh',
    paddingTop: props => props.rowsPerPage > 10 ? theme.spacing(3) : 0,
    [theme.breakpoints.only('xl')]: {
      width: '50vw'
    },
    [theme.breakpoints.only('lg')]: {
      width: '75vw'
    },
    [theme.breakpoints.down('md')]: {
      width: '95vw'
    }
  },
  tableBox: {
    display: 'flex',
    height: '100%',
    margin: 0,
    padding: 0,
    width: '100%',
  },
  table: {
    // display: 'flex',
    height: '100%',
    overflow: 'hidden',
    // margin: 0,
    // padding: 0,
    // [theme.breakpoints.up('lg')]: {
    //   width: '100%',
    // },
    // [theme.breakpoints.down('md')]: {
    //   width: '95%'
    // }
  },
  body: {
    overflow: 'overlay'
  },
  pagination: {
    backgroundColor: theme.palette.secondary.main,
    bottom: 0,
    minHeight: '52px',
    overflow: 'hidden',
    position: 'sticky',
    top: 'auto',
    zIndex: theme.zIndex.drawer,
    [theme.breakpoints.up('lg')]: {
      width: '100%',
    },
    [theme.breakpoints.down('md')]: {
      width: '95%'
    }
  }
}));


/**
 * Filter a list of text by multiple metadata constraints.
 * 
 * @param {Object} text The text to filter.
 * @param {string} text.author The author of the text.
 * @param {boolean} text.is_prose Whether the text is prose or poetry.
 * @param {string} text.title The title of the text.
 * @param {number} text.year The year the text was published.
 * @param {Object} filter The user-selected filter values.
 * @param {string} filter.author String pattern to filter author by.
 * @param {boolean} filter.type "All", "Prose", or "Poetry".
 * @param {string} filter.title String pattern to filter title by.
 * @param {number[]} filter.year Lower/upper bounds on the publication year.
 * @returns {boolean} True if the text meets all of the filter criteria.
 */
function filterText(text, filter) {
  // If 'all', ignore. Otherwise, determine if the type is 'prose', then
  // determine if the text's flag matches the selected type.
  let typeFilter = true;
  if (filter.type.toLowerCase() !== 'all') {
    const isProse = filter.type === 'prose';
    typeFilter = isProse === text.is_prose;
  }

  // Search the text's author for the pattern if a pattern was supplied.
  const authorFilter = (
    filter.author === '' ||
    text.author.toLowerCase().search(filter.author) >= 0);
  
  // Search the text's title for the pattern if a pattern was supplied.
  const titleFilter = (
    filter.title === '' ||
    text.title.toLowerCase().search(filter.title) >= 0);

  // Determine if the publication year falls in the supplied bounds.
  const yearFilter = (
    filter.year !== undefined &&
    (text.year >= filter.year[0] || text.year <= filter.year[1])
  );

  // Include the text ONLY if it meets all of the criteria.
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
  const { closeDialog, open, textList } = props;

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  
  const [ bodyRows, setBodyRows ] = useState([]);

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

  useEffect(() => {
    console.log('changing page');
    const start = pagination.currentPage * pagination.rowsPerPage;
    const end = start + pagination.rowsPerPage;
    setBodyRows(
      textList.filter(item => filterText, filter)
      .slice(start, end) 
      .map(item => {
      return (
        <MultitextSelectionTableBodyRow
          text={item}
        />
      );
    }));
  }, [filter, pagination, setBodyRows, textList]);

  const classes = useStyles(pagination);

  const onChangePage = (event, page) => {
    setPagination(prev => ({...prev, currentPage: page}));
  }

  return (
    <ThemedDialog
      actions={null}
      body={
        <Grid container
          alignContent="flex-start"
          alignItems="flex-start"
          className={classes.root}
          justify="center"
        >
          <Grid item lg={4} md={11}>
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
            <Grid item lg={8} md={12}>
            <Box
              alignContent="flex-start"
              alignItems="flex-start"
              className={classes.tableBox}
              justifyContent="flex-start"
              justifyItems="flex-start"
              display="flex"
              flexDirection="column"
              m={0}
              p={0}
              width={1.0}
            >
              <Box
                height={'100%'}
                width={1}
              >
                <TableContainer
                  className={classes.table}
                >
                  <Table
                    size={matches ? 'small' : 'medium'}
                    stickyHeader
                  >
                    <TableHead>
                      <MultitextSelectionTableHeader
                        setPagination={setPagination}
                        sortHeader={pagination.sortHeader}
                        sortOrder={pagination.sortOrder}
                        textList={bodyRows}
                      />
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
                width={1.0}
              >
                <TablePagination
                  ActionsComponent={TablePaginationActions}
                  count={textList.length}
                  labelRowsPerPage="Rows per page:"
                  onChangePage={onChangePage}
                  page={pagination.currentPage}
                  rowsPerPage={pagination.rowsPerPage}
                  rowsPerPageOptions={[10]}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      }
      closeDialog={closeDialog}
      maxWidth="xl"
      open={open}
      scroll="body"
      title="Select Multitext Targets"
    />
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