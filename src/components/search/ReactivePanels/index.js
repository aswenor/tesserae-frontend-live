import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';

import ResultsTable from '../ResultsTable';
import SearchParametersForm from '../SearchParametersForm';
import { render } from 'react-dom';


const styles = theme => ({
  root: {
    display: 'flex',
    paddingTop: 0,
    paddingmarginBottom: 0,
    paddingmarginLeft: 0,
    paddingRight: 0,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      height: '86.5vh'
    },
    [theme.breakpoints.down('xs')]: {
      height: '100%'
    }
  },
  divider: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    width: '10px',
    '&:hover': {
      cursor: 'col-resize'
    },
    [theme.breakpoints.up('md')]: {
      float: 'left'
    }
  }
});


const panelStyles = makeStyles(theme => ({
  root: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    [theme.breakpoints.up('md')]: {
      float: 'left',
      overflowX: 'auto',
      overflowY: 'auto',
      width: props => props.width,
      minWidth: props => props.minWidth
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      minWidth: '100%'
    }
  }
}));


const getTotalWidth = () => window.innerWidth !== null
      ? window.innerWidth
      : window.document.documentElement.clientWidth;


function ReactivePanel(props) {
  const { children } = props;
  const classes = panelStyles(props);

  return (
    <Box
      className={classes.root}
    >
      {children}
    </Box>
  );
}


class ReactivePanels extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leftWidth: props.leftMinWidth,
      moving: false,
      rightWidth: 100 - props.leftMinWidth,
      unit: '%'
    };
  }

  getTotalWidth = () => window.innerWidth !== null
      ? window.innerWidth
      : window.document.documentElement.clientWidth;

  handleClickDivider = event => {
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    if (event.preventDefault) {
      event.preventDefault();
    }
    this.setState({moving: true});
  }

  handleMoveDivider = event => {
    if (this.state.moving) {
      if (event.stopPropagation) {
        event.stopPropagation();
      }
      if (event.preventDefault) {
        event.preventDefault();
      }
      const totalWidth = this.getTotalWidth();
      const mouseX = event.pageX;
      const rightMinWidth = this.props.rightMinWidth * totalWidth / 100;
      const leftMaxWidth = totalWidth - rightMinWidth;
      const leftMinWidth = this.props.leftMinWidth * totalWidth / 100;
      const leftWidth = Math.min(Math.max(mouseX, leftMinWidth), leftMaxWidth);
      const rightWidth = totalWidth - leftWidth;

      this.setState({ leftWidth, rightWidth, unit: 'px' });
    }
  }

  handleReleaseDivider = event => {
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    if (event.preventDefault) {
      event.preventDefault();
    }
    this.setState({moving: false});
  }
  
  render() {
    const { leftWidth, rightWidth, unit } = this.state;
    const { classes, leftMinWidth, rightMinWidth } = this.props;
    
    const totalWidth = this.getTotalWidth()
    const leftWidthVal = `${leftWidth}${unit}`;
    const leftMinWidthVal = totalWidth * (leftMinWidth / 100);
    const rightWidthVal = `${rightWidth - 2}${unit}`;
    const rightMinWidthVal = totalWidth * (rightMinWidth / 100);

    return (
      <Box
        className={classes.root}
        component="div"
        onMouseMove={this.handleMoveDivider}
        onMouseUp={this.handleReleaseDivider}
      >
        <ReactivePanel
          minWidth={leftMinWidthVal}
          width={leftWidthVal}
        >
          <SearchParametersForm />
        </ReactivePanel>
        <Hidden only={['xs', 'sm']}>
          <Divider
            className={classes.divider}
            onMouseDown={this.handleClickDivider}
            orientation='vertical'
          />
        </Hidden>
        <ReactivePanel
          minWidth={rightMinWidthVal}
          width={rightWidthVal}
        >
          <ResultsTable />
        </ReactivePanel>
      </Box>
    );
  }
}


export default withStyles(styles)(ReactivePanels);