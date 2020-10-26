import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { find } from 'lodash';

import TableBody from '@material-ui/core/TableBody';

import MultitextResultsTableRow from './MultitextResultsTableRow';


function MultitextResultsTableBody(props) {
  const { multitextResults, results, startIdx } = props;

  const rows = results.map((item, idx) => {
    return (
      <MultitextResultsTableRow
        highlight={item.highlight}
        idx={startIdx + idx}
        matched_features={item.matched_features}
        multiresults={find(multitextResults, x => x.match === item.object_id)}
        object_id={item.object_id}
        score={item.score}
        source_snippet={item.source_snippet}
        source_tag={item.source_tag}
        target_snippet={item.target_snippet}
        target_tag={item.target_tag}
      />
    );
  });

  return (
    <TableBody>
      {rows}
    </TableBody>
  );
}


function mapStateToProps(state) {
  return {
    multitextResults: state.multitext.results,
    results: state.search.results,
    startIdx: state.pagination.currentPage * state.pagination.rowsPerPage + 1,
  };
}


export default connect(mapStateToProps)(MultitextResultsTableBody);