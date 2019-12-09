import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import classNames from 'classnames';

import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles, useTheme } from '@material-ui/core/styles';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import SearchParametersForm from '../SearchParametersForm';


import { searchReducer } from '../../../state_management/search';


const drawerWidth = '30%';

const styles = theme => ({
  root: {
    display: 'flex'
  },
  drawer: {
    overflowX: 'hidden',
    padding: 0,
    width: drawerWidth,
    flexShrink: 0,
    zIndex: theme.zIndex.drawer + 2,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  expansionPanelDetails: {
    width: 'flex',
    margin: 0,
    paddingTop: 0
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


const store = createStore(searchReducer);


class SearchPrototypeB extends React.Component {
    state = {
        open: true
    }

    render() {
        const { open } = this.state;
        const { classes } = this.props;

        return (
            <main>
                <Provider store={store}>
                    <Drawer
                        className={classes.drawer}
                        variant='temporary'
                        open={open}
                    >
                        <SearchParametersForm />
                    </Drawer>
                </Provider>
            </main>
        );
    }
}


export default withStyles(styles)(SearchPrototypeB);