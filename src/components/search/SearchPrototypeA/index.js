import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import SearchParametersForm from '../SearchParametersForm';

import { getAvailableLanguages } from '../../../api/corpus';


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


class SearchPrototypeA extends React.Component {
  state = {
    currentTab: 0,
    language: "Latin",
    languages: getAvailableLanguages()
  }

  handleChangeTab = (language) => {
    this.setState({ language });
  }

  render() {
    const { currentTab, language, languages } = this.state;
    // const classes = useStyles();

    const tabs = languages.map((item, idx) => {
      return <Tab label={item} { ...a11yProps(idx) } />
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
        <AppBar position="static">
          <Tabs>
            {tabs}
          </Tabs>
        </AppBar>
        {forms}
      </main>
    );
  }
}


export default SearchPrototypeA;
