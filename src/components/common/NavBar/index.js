import React from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    width: '100%'
  },
  logo: {
    height: '100%',
    maxHeight: '50px',
    width: 'auto',
    margin: 0,
    padding: 0
  }
}));


export default function NavBar(props) {
  const classes = useStyles();
  const routes = props.routes.map((route, i) => {
    return (
      <Button
        component={Link}
        key={route.link}
        to={route.link}
      >
        {route.name}
      </Button>
    );
  });

  return (
    <AppBar className={classes.root} position="static">
      <Toolbar>
        <Box
          flexGrow={1}
        >
          <img
            className={classes.logo}
            src={"/TesseraeLogo.png"}
            alt="Tesserae"
          />
        </Box>
        {routes}
      </Toolbar>
    </AppBar>
  );
}
