import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import ArrowBackIcon from '@material-ui/icons/ArrowForward';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';



import { getAvailableLanguages } from '../../../api/corpus';
import { updateSearchParameters } from '../../../state_management/search';


const useStyles = makeStyles({

});


async function getLanguages() {
  let l = await getAvailableLanguages();
  return l.sort().map(item => `${item[0].toUpperCase()}${item.slice(1)}`);
}


let languages = getAvailableLanguages().sort();


const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


function PanelOpenIcon(props) {
  const { onClick, open } = props;
  const icon = open ? <ArrowBackIcon /> : <ArrowForwardIcon />
  return (
    <Hidden only={['xs', 'sm']}>
      <IconButton
        aria-label={open ? "open panel" : "close panel"}
        onClick={onClick}
      >
        {icon}
      </IconButton>
    </Hidden>
  );
}


function LanguagesAppBar(props) {
  const { dispatch, open, handlePanelOpen } = props;
  const [currentTab, setCurrentTab] = useState(1);
  const classes = useStyles();

  console.log(open);

  function handleChangeTab(tabIdx) {
    const language = languages[tabIdx];
    dispatch(updateSearchParameters({ language }));
    setCurrentTab(tabIdx);
  }

  const tabs = languages.map((item, idx) => {
    return (
      <Tab
        key={item}
        label={item}
        value={idx}
        onClick={() => handleChangeTab(idx)}
        { ...a11yProps(idx) }
      />
    )
  });

  return (
    <AppBar position="static">
      <Grid container spacing={2}>
        <Grid item xs={1}>
          <PanelOpenIcon
            onClick={handlePanelOpen}
            open={open}
          />
        </Grid>
        <Grid item xs={11}>
          <Tabs
            className={classes.tabs}
            value={currentTab}
          >
            {tabs}
          </Tabs>
        </Grid>
      </Grid>
    </AppBar>
  );
}


function mapStateToProps(state) {
  return {
    language: state.language
  };
}

export default connect(mapStateToProps)(LanguagesAppBar);
