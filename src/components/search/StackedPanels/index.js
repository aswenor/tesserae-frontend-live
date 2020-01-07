import React from 'react';

import Grid from '@material-ui/core/Grid';

import ResultsTable from '../ResultsTable';
import SearchParametersForm from '../SearchParametersForm';


function StackedPanels(props) {
  return (
    <Grid
      container
      alignContent="center"
      direction="row"
    >
      <Grid item xs={12}>
        <SearchParametersForm />
      </Grid>
      <Grid item xs={12}>
        <ResultsTable />
      </Grid>
    </Grid>
  );
}


export default StackedPanels;