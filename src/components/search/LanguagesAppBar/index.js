import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
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

import { fetchLanguagesAction, updateLanguageAction } from '../../../api/corpus';


const useStyles = makeStyles({

});


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
  const { dispatch, availableLanguages, fetchLanguages, handlePanelOpen,
          open, pending, updateLanguage } = props;
  const [currentTab, setCurrentTab] = useState(0);
  const classes = useStyles();

  if (!availableLanguages || availableLanguages.length === 0) {
    fetchLanguages(pending);
  }

  function handleChangeTab(tabIdx) {
    const language = availableLanguages[tabIdx];
    updateLanguage(language);
    setCurrentTab(tabIdx);
  }

  let tabs = [];

  if (availableLanguages && availableLanguages.length > 0) {
    tabs = availableLanguages.map((item, idx) => {
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
  }

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
    availableLanguages: state.availableLanguages,
    language: state.language,
    pending: state.asyncPending
  };
}

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchLanguages: fetchLanguagesAction,
  updateLanguage: updateLanguageAction
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LanguagesAppBar);
