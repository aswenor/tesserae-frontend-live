import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

// import FirstPageIcon from '@material-ui/core/FirstPageIcon';
// import KeyboardArrowLeft from '@material-ui/core/KeyboardArrowLeft';
// import KeyboardArrowRight from '@material-ui/core/KeyboardArrowRight';
// import LastPageIcon from '@material-ui/core/LastPageIcon';


function ResultsTableHeader(props) {
  const { labels, sortHeader, sortOrder } = props;

  const headCells = labels.map(item => {
      const itemNorm = item.toLowerCase();
      return (
        <TableCell
          key={itemNorm}
          align="center"
          sortDirection={sortHeader === itemNorm ? sortOrder : false}
        >
          <TableSortLabel
            active={sortHeader === itemNorm}
            direction={sortOrder}
          >
            {item}
          </TableSortLabel>
        </TableCell>
      );
    }
  );

  return (
    <TableHead>
      <TableRow>
        {headCells}
      </TableRow>
    </TableHead>
  );
}


function ResultsTableBody(props) {
  const { results } = props;

  const bodyCells = results.map((item, idx) => {
    return (
      <TableRow
        hover
        tabIndex={-1}
        key={item.source + item.target + item.matches.join()}
      >
        <TableCell>{idx}</TableCell>
        <TableCell>{item.source_locus}{item.source}</TableCell>
        <TableCell>{item.target_locus}{item.target}</TableCell>
        <TableCell>{item.matches.join()}</TableCell>
        <TableCell>{item.score}</TableCell>
      </TableRow>
    );
  });

  return (
    <TableBody>
      {bodyCells}
    </TableBody>
  );
}


class ResultsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      resultsPerPage: 100,
      sortHeader: 'score',
      sortOrder: -1
    }
  }

  handleChangePage = (event, newPage) => {
    const nPages = Math.ceil(this.props.results.length / this.state.resultsPerPage);
    const page = Math.min(Math.max(page, 0), nPages);
    this.setState({ page });
  }

  handleChangeRowsPerPage = event => {
    const value = parseInt(event.target.value, 10);
    const resultsPerPage = Math.min(Math.max(value, 0), this.props.results.length)
    this.setState({
      resultsPerPage: resultsPerPage,
      page: 0
    })
  }

  render() {
    const { results } = this.props;
    const { page, resultsPerPage, sortHeader, sortOrder } = this.state;

    const headerLabels = ['', 'Source', 'Target', 'Matched On', 'Score'];

    const start = page * resultsPerPage;
    const end = Math.min(start + resultsPerPage, results.length);

    const displayResults = results.sort((a, b) => {
      if (b[sortHeader] < a[sortHeader]) {
        return -1 * sortOrder;
      }
      else if (b[sortHeader] > a[sortHeader]) {
        return 1 * sortOrder;
      }
      else {
        return 0;
      }
    }).slice(start, end);

    return (
      <Paper>
        <div>
          <Table>
            <ResultsTableHeader
              labels={headerLabels}
              sortHeader={sortHeader}
              sortOrder={sortOrder}
            />
            <ResultsTableBody results={displayResults} />
          </Table>
        </div>
        <TablePagination
          component="div"
          count={results.length}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
          page={page}
          rowsPerPage={resultsPerPage}
          rowsPerPageOptions={[50, 100, 200, 500]}
        />
      </Paper>
    );
  }
}


export default ResultsTable;
