import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';

import ResultsTable from '../ResultsTable';
import SearchParametersForm from '../SearchParametersForm';


const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    width: "100%"
  },
  drawer: {
    zIndex: theme.zIndex.appBar - 1
  },
  leftDrawer: {
    [theme.breakpoints.up('md')]: {
      minWidth: props => props.open ? props.leftMinWidth : "0%",
      width: props => props.open && props.leftWidth > props.leftMinWidth ? props.leftWidth : props.leftMinWidth
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: "100%",
      width: "100%"
    }
  },
  divider: {
    [theme.breakpoints.up('md')]: {
      display: props => props.open ? "auto" : "hidden",
      width: "10px"
    },
    [theme.breakpoints.down('sm')]: {
      display: "hidden"
    }
  },
  rightDrawer: {
    [theme.breakpoints.up('md')]: {
      minWidth: props => props.open ? props.rightMinWidth : "100%",
      width: props => props.open && props.rightWidth > props.rightMinWidth ? props.rightWidth : props.rightMinWidth
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: "100%",
      width: "100%"
    }
  }
}));


const getTotalWidth = () => window.innerWidth !== null
  ? window.innerWidth
  : window.document.documentElement.clientWidth;


function ReactivePanels(props) {
  const { leftMinWidth, open, rightMinWidth } = props;

  const totalWidth = getTotalWidth();

  const [state, setState] = useState({
    leftWidth: `${leftMinWidth}%`,
    moving: false,
    rightWidth: `${100 - rightMinWidth}%`,
  });

  const classes = useStyles({...state, ...props});

  function startMove(event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    if (event.preventDefault) {
      event.preventDefault();
    }
    setState({...state, moving: true})
  }

  function setPanelWidths(event) {
    if (state.moving) {
      if (event.stopPropagation) {
        event.stopPropagation();
      }
      if (event.preventDefault) {
        event.preventDefault();
      }

      const mouseX = event.pageX;
      const rightMinWidth = rightMinWidth * totalWidth / 100;
      const leftMaxWidth = totalWidth - rightMinWidth;
      const leftMinWidth = leftMinWidth * totalWidth / 100;
      const leftWidth = Math.min(Math.max(mouseX, leftMinWidth), leftMaxWidth);
      const rightWidth = totalWidth - leftWidth;

      setState({ ...state, leftWidth: `${leftWidth}px`, rightWidth: `${rightWidth}px` });
    }
  }

  return (
    <div
      className={classes.root}
      onMouseMove={setPanelWidths}
      onMouseUp={() => setState({...state, moving: false})}
    >
      <Drawer
        anchor="left"
      >
        <SearchParametersForm />
      </Drawer>
      <Divider 
        onMouseDown={startMove}
        orientation="vertical"
      />
      <Drawer
        anchor="right"
      >
        <ResultsTable />
      </Drawer>
    </div>
  );
}


export default ReactivePanels;