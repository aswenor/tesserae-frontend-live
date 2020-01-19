import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const routes = this.props.routes.map((route, i) => {
      return (
        <Button component={Link} to={route.link} key={i}>
          {route.name}
        </Button>
      );
    });

    return (
      <AppBar className="tess-navbar" position="static">
        <Toolbar className="">
          <Typography variant="h6" color="inherit">Tesserae</Typography>
          {routes}
        </Toolbar>
      </AppBar>
    );
  }
}


export default NavBar;
