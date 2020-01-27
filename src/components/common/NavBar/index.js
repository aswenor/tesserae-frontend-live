import React from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  logo: {
    height: '100%',
    maxHeight: '50px',
    width: 'auto',
    margin: 0,
    padding: 0
  },
  routeGrid: {
    display: 'flex',
    height: '100%',
    verticalAlign: 'middle'
  },
  route: {
    height: '100%',
    verticalAlign: 'middle'
  }
}));


export default function NavBar(props) {
  const classes = useStyles();
  const routes = props.routes.map((route, i) => {
    return (
      <Grid item
        className={classes.routeGrid}
        key={route.link}
        sm={2}
      >
        <Button
          className={classes.route}
          component={Link}
          to={route.link}
        >
          {route.name}
        </Button>
      </Grid>
    );
  });

  return (
    <AppBar className={classes.root} position="static">
      <Toolbar className="">
        <Grid container alignItems="flex-start">
          <Grid item xs={3} alignContent="flex-start">
            <img
              className={classes.logo}
              src={"/TesseraeLogo.png"}
              alt="Tesserae"
            />
          </Grid>
          <Grid item xs={9}>
            <Grid container alignItems="flex-end" spacing={2}>
              {routes}
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
