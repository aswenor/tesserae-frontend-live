import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import SearchParametersForm from '../SearchParametersForm';
import ResultsTable from '../ResultsTable';

import { getAvailableLanguages } from '../../../api/corpus';
import { searchReducer } from '../../../state_management/search';


export function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {children}
    </Typography>
  );
}


const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


// const dummyResults = [
//   {
//     sourceLocus:
//   }
// ]


// const useStyles = makeStyles(theme => ({
//   root: {
//     flexGrow: 1,
//     backgroundColor: theme.palette.background.paper,
//   },
// }));


const store = createStore(searchReducer);


class SearchPrototypeA extends React.Component {
  constructor(props) {
    super(props);
    const languages = getAvailableLanguages().sort();
    this.state = {
      currentTab: languages.indexOf('latin'),
      language: languages[languages.indexOf('latin')],
      languages: languages
    };
  }

  handleChangeTab = (tabIdx) => {
    const newTab = tabIdx;
    const newLang = this.state.languages[newTab];
    this.setState({ language: newLang, currentTab: newTab });
  }

  render() {
    const { currentTab, language, languages } = this.state;
    // const classes = useStyles();

    const tabs = languages.map((item, idx) => {
      return (
        <Tab
          label={item}
          value={idx}
          onClick={() => this.handleChangeTab(idx)}
          { ...a11yProps(idx) }
        />
      )
    });

    return (
      <main>
        <Provider store={store}>
          <AppBar position="static">
            <Tabs value={currentTab}>
              {tabs}
            </Tabs>
          </AppBar>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Paper>
                <SearchParametersForm language={language} />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper>
                <Typography variant="h5">
                  Results
                </Typography>
                <ResultsTable />
              </Paper>
            </Grid>
          </Grid>
        </Provider>
      </main>
    );
  }
}


export default SearchPrototypeA;
