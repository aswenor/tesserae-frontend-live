/**
 * @fileoverview Page handling corpus management operations.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports CorpusManager
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:react-redux
 * @requires ./CorpusViewer
 * @requires ./CorpusViewerSideBar
 * @requires ../common/HorizontalResizePanels
 * @requires ../common/PageContainer
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core';

import CorpusViewer from './CorpusViewer';
import CorpusViewerSidebar from './CorpusViewerSidebar';
import HorizontalResizePanels from '../common/HorizontalResizePanels';
import PageContainer from '../common/PageContainer';


const useStyles = makeStyles({
  
});


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


/**
 * Page handling corpus management operations.
 * 
 * @component
 * @example
 *   return (
 *     <CorpusManager
 *        availableTexts={[{
 *          author: 'vergil',
 *          is_prose: false,
 *          object_id: '89237645fa965',
 *          title: 'aeneid',
 *          year: -25
 *        }]}
 *        routes={[{
 *          link: '#',
 *          name: 'Other Page'
 *        }]}
 *     /> 
 *   );
 */
function CorpusManager(props) {
  const { availableTexts, routes } = props;

  /**
   * Local filter state and passed to the filter component.
   */
  const [ filter, setFilter ] = useState({
    type: 'all',
    author: '',
    title: '',
    year: [-10000000, 100000000]
  });

  /**
   * Whether the sidebar is open.
   */
  const [isOpen, setIsOpen] = useState(true);

  /**
   * The texts of the corpus filtered by the user-supplied criteria.
   */
  const textList = availableTexts.filter(item => filterText(item, filter));

  return (
      <PageContainer
        routes={routes}
        showLanguages
        toggleSideBar={(event) => setIsOpen(prevOpen => !prevOpen)}
      >
        <HorizontalResizePanels
          leftChild={
            availableTexts.length > 0
             ?  <CorpusViewerSidebar
                  filter={filter}
                  setFilter={setFilter}
                  show={availableTexts.length > 0}
                />
             : <div></div>
            
          }
          leftMinWidth={20}
          open={isOpen}
          rightChild={<CorpusViewer textList={textList} />}
          rightMinWidth={35}
        />
      </PageContainer>
  );
}


CorpusManager.propTypes = {
  /**
   * Array of text metadata comprising the loaded corpus.
   */
  availableTexts: PropTypes.arrayOf(
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
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * URL of the route.
       */
      link: PropTypes.string,

      /**
       * Display name of the route.
       */
      name: PropTypes.string,      
    })
  )
}


/**
 * Add redux store state to this component's props.
 * 
 * @param {object} state The global state of the application.
 * @returns {object} Members of the global state to provide as props.
 */
function mapStateToProps(state) {
  return {
    availableTexts: state.corpus.availableTexts
  }
}

// Do redux binding here.
export default connect(mapStateToProps)(CorpusManager);