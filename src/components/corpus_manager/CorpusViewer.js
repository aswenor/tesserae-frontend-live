/**
 * @fileoverview Table displaying metadata about texts in the corpus.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports CorpusManager
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:react-redux
 * @requires NPM:@material-ui/core
 * @requires ../common/BodyScrollTable
 * @requires ./CorpusViewerBodyRow
 * @requires ./CorpusViewerHeader
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Box from '@material-ui/core/Box';

import BodyScrollTable from '../common/BodyScrollTable';
import CorpusViewerBodyRow from './CorpusViewerBodyRow';
import CorpusViewerHeader from './CorpusViewerHeader';


/**
 * Table displaying metadata about texts in the corpus.
 * 
 * @component
 * @example
 *   return (
 *     <CorpusViewer
 *       currentPage={0}
 *       rowsPerPage={10}
 *       sortHeader="author"
 *       sortOrder={1}
 *       textList={[{
 *         author: 'vergil',
 *         is_prose: true,
 *         object_id: '89237645fa965',
 *         title: 'aeneid',
 *         year: -25
 *       }]}
 *     />
 *   );
 */
function CorpusViewer(props) {
  const { currentPage, rowsPerPage, sortHeader, sortOrder, textList } = props;

  /**
   * The first and last entries to select from textList.
   */
  const start = currentPage * rowsPerPage;
  const end = start + rowsPerPage;

  /**
   * Determine the order of two objects by a given field.
   * 
   * @param {Object} a 
   * @param {Object} b 
   * @returns {number} -1, 0, or 1 depending on equality
   */
  const compareTexts = (a, b) => {
    if (a[sortHeader] < b[sortHeader]) {
      return sortOrder
    }
    else if (a[sortHeader] < b[sortHeader]) {
      return -sortOrder
    }
    else {
      return 0;
    }
  };

  /**
   * Array of rows of the table.
   */
  const bodyRows = textList.slice().sort(compareTexts).slice(start, end).map(item => {
    return (<CorpusViewerBodyRow text={item} />);
  });

  return (
    <Box
      display="flex"
      flexGrow={1}
      height={'100%'}
      m={0}
      width={1}
    >
      <BodyScrollTable
        bodyCount={textList.length}
        bodyRows={bodyRows}
        headerRow={<CorpusViewerHeader />}
        initialRowsPerPage={25}
        onPageChange={() => {}}
        rowsPerPageLabel="Rows Per Page:"
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </Box>
  );
}


CorpusViewer.propTypes = {
  /**
   * The page of texts to display.
   */
  currentPage: PropTypes.number,

  /**
   * The number of texts comprising one page.
   */
  rowsPerPage: PropTypes.number,

  /**
   * The column to sort by.
   */
  sortHeader: PropTypes.string,

  /**
   * The direction to sort (-1 or 1).
   */
  sortOrder: PropTypes.number,

  /**
   * List of texts to display in the table.
   */
  textList: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * Name of the author of the text.
       */
      author: PropTypes.string,

      /**
       * Whether the text is prose or poetry.
       */
      isProse: PropTypes.bool,

      /**
       * Database ID of the text.
       */
      object_id: PropTypes.string,

      /**
       * Title of the text.
       */
      title: PropTypes.string,

      /**
       * Year that the text was published.
       */
      year: PropTypes.number
    })
  ),
};


/**
 * Add redux store state to this component's props.
 * 
 * @param {object} state The global state of the application.
 * @returns {object} Members of the global state to provide as props.
 */
function mapStateToProps(state) {
  return {
    currentPage: state.pagination.currentPage,
    rowsPerPage: state.pagination.rowsPerPage,
    sortHeader: state.pagination.sortHeader,
    sortOrder: state.pagination.sortOrder
  };
}


// Do redux binding here.
export default connect(mapStateToProps)(CorpusViewer);