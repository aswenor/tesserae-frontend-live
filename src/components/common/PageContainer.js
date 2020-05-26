import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import LanguageSelectMenu from './LanguageSelectMenu';
import NavBar from './NavBar';


const useStyles = makeStyles(theme => ({
  button: {
    border: '1px solid #000000',
    background: '#ffffff'
  },
}))

function PageContainer(props) {
  const { children, routes, showLanguages } = props;

  return (
    <Box>
      <NavBar routes={routes}>
          <LanguageSelectMenu />
      </NavBar>
      {children}
    </Box>
  );
}


export default PageContainer;