import React from 'react';
import { connect } from 'react-redux';

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
  const { handleSortUpdate, labels, sortHeader, sortOrder } = props;
  const sortDirection = sortOrder === 1 ? 'asc' : 'desc';

  const headCells = labels.map(item => {
      const itemNorm = item.toLowerCase();
      return (
        <TableCell
          key={itemNorm}
          align="center"
          onClick={() => handleSortUpdate(itemNorm)}
          sortDirection={sortHeader === itemNorm ? sortDirection : false}
        >
          <TableSortLabel
            key={itemNorm}
            active={sortHeader === itemNorm}
            direction={sortDirection}
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
        key={item.source + item.target + item.matches}
      >
        <TableCell>{idx + 1}</TableCell>
        <TableCell>{item.source} {item.sourceText}</TableCell>
        <TableCell>{item.target} {item.targetText}</TableCell>
        <TableCell>{item.matchedOn}</TableCell>
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


const resultsList = [
  {
    target: 'luc. 1.51',
    targetText: "Cedetur, iurique tuo natura relinquet,",
    source: 'verg. aen. 11.359',
    sourceText: 'cedat, ius proprium regi patriaeque remittat.',
    matchedOn: 'cedo, ius',
    score: 10
  },
  {
    target: 'luc. 1.635',
    targetText: 'Sed venient maiora metu. Di visa secundent, ',
    source: 'verg. aen. 3.36',
    sourceText: 'rite secundarent visus omenque levarent.',
    matchedOn: 'secundo, uideo-uiso',
    score: 10
  },
  {
    target: 'luc. 1.638',
    targetText: 'Involvens multaque tegens ambage canebat. ',
    source: 'verg. aen. 6.29',
    sourceText: 'Daedalus ipse dolos tecti ambagesque resolvit,',
    matchedOn: 'ambages-ambago, tego',
    score: 10
  },
  {
    target: 'luc. 1.558',
    targetText: 'Dona suis, dirasque diem foedasse volucres',
    source: 'verg. aen. 3.241',
    sourceText: 'obscenas pelagi ferro foedare volucres:',
    matchedOn: 'foedo, uolucer-uolucris',
    score: 9
  },
  {
    target: 'luc. 1.549',
    targetText: 'Latravere canes. Vestali raptus ab ara',
    source: 'verg. aen. 5.257',
    sourceText: 'custodes, saevitque canum latratus in auras.',
    matchedOn: 'canis, latro',
    score: 9
  },
  {
    target: 'luc. 1.645',
    targetText: 'Humano matura lues. Terraene dehiscent,',
    source: 'verg. aen. 8.243',
    sourceText: 'non secus ac siqua penitus vi terra dehiscens',
    matchedOn: 'terra, dehisco',
    score: 8
  },
]


class ResultsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      resultsPerPage: 100,
      sortHeader: 'score',
      sortOrder: 1
    }
  }

  handleChangePage = (event, newPage) => {
    const nPages = Math.ceil(this.props.results.length / this.state.resultsPerPage);
    const page = Math.min(Math.max(page, 0), nPages);
    this.setState({ page });
  }

  handleChangeRowsPerPage = event => {
    const value = parseInt(event.target.value, 10);
    const resultsPerPage = Math.min(Math.max(value, 0), 500);
    this.setState({
      resultsPerPage: resultsPerPage,
      page: 0
    })
  }

  handleSortUpdate = header =>{
    const { sortHeader, sortOrder } = this.state
    const newSortHeader = header.toLowerCase();
    const newSortOrder = newSortHeader === sortHeader ? -sortOrder : -1;
    this.setState({
      sortHeader: newSortHeader,
      sortOrder: newSortOrder
    });
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
              handleSortUpdate={this.handleSortUpdate}
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
          labelRowsPerPage="Results per page:"
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


function mapStateToProps(state) {
  return {
    results: resultsList
  }
}


export default connect(mapStateToProps)(ResultsTable);
