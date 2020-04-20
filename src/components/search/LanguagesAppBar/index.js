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

import MenuIcon from '@material-ui/icons/Menu';

import { fetchLanguagesAction, updateLanguageAction } from '../../../api/corpus';


const useStyles = makeStyles({

});


const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


function LanguagesAppBar(props) {
  const { availableLanguages, fetchLanguages, handlePanelOpen,
          open, pending, updateLanguage } = props;
  const [currentTab, setCurrentTab] = useState(0);
  const classes = useStyles();

  if (!availableLanguages || availableLanguages.length === 0) {
    fetchLanguages(pending);
  }

  function handleChangeTab(tabIdx) {
    const language = availableLanguages[tabIdx];
    console.log(`Selecting ${language} from ${availableLanguages} at position ${tabIdx}`);
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
      <Grid container
        alignContent="center"
        alignItems="flex-start"
        justify="flex-start"
      >
        <Hidden only={['xs', 'sm']}>
          <Grid item xs={1}>
            <IconButton
              ariaLabel={open
                         ? 'Hide Search Parameters'
                         : 'View Search Parameters'}
              onClick={handlePanelOpen}
            >
              <MenuIcon />
            </IconButton>
          </Grid>
        </Hidden>
        <Grid item md={11} xs={12}>
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
