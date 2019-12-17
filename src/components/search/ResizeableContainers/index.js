import React from 'react';

import Divider from '@material-ui/core/Divider';

import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
  leftPanel: {
    height: '88vh'
  },
  divider: {
    '&:hover': { 
      cursor: 'col-resize'
    }
  },
  rightPanel: {
    height: '88vh'
  }
});


class ResizeableContainers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leftWidth: '50vh',
      moving: false,
      rightWidth: '50vh',
    };
  }

  handleClickDivider = event => {
    this.setState({moving: true});
  }

  handleMoveDivider = event => {
    
  }

  handleReleaseDivider = event => {
    this.setState({moving: false});
  }
  
  render() {
    const { leftWidth, moving, rightWidth } = this.state;
    const { classes } = this.props;

    const leftStyles = {
      ...classes.leftStyles,
      width: leftWidth
    };

    const rightStyles = {
      ...classes.rightStyles,
      width: rightWidth
    };

    return (
      <div>
        <div className={leftStyles}>

        </div>
        <Divider
          className={classes.divider}
          onMouseDown={this.handleClickDivider}
          onMouseMove={this.handleMoveDivider}
          onMouseUp={this.handleReleaseDivider}
          orientation='vertical'  
        />
        <div className={leftStyles}>

        </div>
      </div>
    );
  }
}


export default withStyles(styles)(ResizeableContainers);