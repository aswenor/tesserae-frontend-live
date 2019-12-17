import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import classNames from 'classnames';

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { withStyles, useTheme } from '@material-ui/core/styles';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import SearchParametersForm from '../SearchParametersForm';
import ResultsTable from '../ResultsTable';

import { getAvailableLanguages } from '../../../api/corpus';
import { searchReducer } from '../../../state_management/search';


const drawerWidth = '30%';

const styles = theme => ({
  root: {
    display: 'flex'
  },
  parametersPanel: {
    height: '88vh',
    borderRight: '3px solid black',
    overflowY: 'scroll',
  },
  tablePanel: {
    height: '88vh',
    overflorwY: 'scroll' 
  },
  tabs: {
    width: '100%'
  }
});


function DrawerIconButton(props) {
  const icon = props.open ? <ChevronLeftIcon /> : <ChevronRightIcon />;
  return (
    <IconButton onClick={props.onClick}>
      {icon}
    </IconButton>
  );
}


export function TabPanel(props) {
  const { children, value, index, ...other } = props;
  console.log(children)
  console.log(value)
  console.log(index)
  console.log(other)
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


const store = createStore(searchReducer);


class SearchPrototypeB extends React.Component {
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
    const { classes } = this.props;
    const { currentTab, language, languages } = this.state;

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
      <main className={classes.root}>
        <Provider store={store}>
          <Grid container spacing={0}>
            <AppBar position="static">
              <Tabs
                className={classes.tabs}
                value={currentTab}
              >
                {tabs}
              </Tabs>
            </AppBar>
            <Grid item sm={4} xs={12}>
              <Paper className={classes.parametersPanel}>
                <SearchParametersForm />
              </Paper>
            </Grid>
            <Grid item sm={8} xs={12}>
              <Paper className={classes.tablePanel}>
                <ResultsTable />
              </Paper>
            </Grid>
          </Grid>
        </Provider>
      </main>
    );
  }
}


export default withStyles(styles)(SearchPrototypeB);
