import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import SearchParametersForm from '../SearchParametersForm';

import { getAvailableLanguages } from '../../../api/corpus';
import { searchReducer } from '../../../state_management/search';


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


// const useStyles = makeStyles(theme => ({
//   root: {
//     flexGrow: 1,
//     backgroundColor: theme.palette.background.paper,
//   },
// }));


const store = createStore(searchReducer);


class SearchPrototypeA extends React.Component {
  state = {
    currentTab: 0,
    language: 'Latin',
    languages: getAvailableLanguages()
  }

  handleChangeTab = (event) => {
    const newTab = event.target.value;
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
          value={item}
          onClick={this.handleChangeTab}
          { ...a11yProps(idx) }
        />
      )
    });

    const forms = languages.map((item, idx) => {
      return (
        <TabPanel value={currentTab} index={idx}>
          <SearchParametersForm language={item} />
        </TabPanel>
      );
    });

    return (
      <main>
        <Provider store={store}>
          <AppBar position="static">
            <Tabs value={language}>
              {tabs}
            </Tabs>
          </AppBar>
          <SearchParametersForm language={language} />
        </Provider>
      </main>
    );
  }
}


export default SearchPrototypeA;
