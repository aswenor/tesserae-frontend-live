import React from 'react';

import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

import { withStyles } from '@material-ui/core/styles';

import ResizeBox from '../../common/ResizeBox';
import ResultsTable from '../ResultsTable';
import SearchParametersForm from '../SearchParametersForm';


const styles = theme => ({
  root: {
    display: 'flex',
    width: '100vw',
    height: '88.5vh'
  },
  divider: {
    width: '10px',
    '&:hover': {
      cursor: 'col-resize'
    }
  }
});


class ResizeableContainers extends React.Component {
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
    const { leftWidth, moving, rightWidth, unit } = this.state;
    const { classes, leftMinWidth, rightMinWidth } = this.props;

    const totalWidth = this.getTotalWidth()
    const leftWidthVal = `${leftWidth}${unit}`;
    const leftMinWidthVal = totalWidth * (leftMinWidth / 100);
    const rightWidthVal = `${rightWidth}${unit}`;
    const rightMinWidthVal = totalWidth * (rightMinWidth / 100);

    return (
      <Box
        component="div"
        id="resizeable-outerbox"
        className={classes.root}
        onMouseMove={this.handleMoveDivider}
        onMouseUp={this.handleReleaseDivider}
      >
        <ResizeBox
          component="div"
          width={leftWidthVal}
          minWidth={leftMinWidthVal}
        >
          <SearchParametersForm width={leftWidthVal}/>
        </ResizeBox>
        <Divider
          className={classes.divider}
          onMouseDown={this.handleClickDivider}
          orientation='vertical'
        />
        <ResizeBox
          component="div"
          width={rightWidthVal}
          minWidth={rightMinWidthVal}
        >
          <ResultsTable />
        </ResizeBox>
      </Box>
    );
  }
}


export default withStyles(styles)(ResizeableContainers);
