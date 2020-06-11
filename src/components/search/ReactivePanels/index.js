/**
 * @fileoverview Content panels that can be horizontally resized.
 * 
 * This particular component is relatively complicated and requires more
 * moving parts than most to maintian the structure and reactive sizes of
 * the child components. In short, there is a container with two vertical
 * panels and a divider between them. The divider can be moved horizontally,
 * and this resizes the two panels in their CSS.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @exports LanguagesAppBar
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:redux
 * @requires NPM:react-redux
 * @requires NPM:@material-ui/core
 * @requires NPM:@material-ui/icons
 * @requires ../ResultsTable
 * @requires ../SearchParametersForm
 * @requires ../../../utils
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';

import ResultsTable from '../ResultsTable';
import SearchParametersForm from '../SearchParametersForm';
import { getTotalWidth } from '../../../utils';


/** CSS styles to apply to the component. */
const useStyles = makeStyles(theme => ({
  root: {
    overflow: 'hidden',
    paddingTop: 0,
    paddingmarginBottom: 0,
    paddingmarginLeft: 0,
    paddingRight: 0,
    width: '100vw',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      height: '93vh',
    },
    [theme.breakpoints.down('xs')]: {
      display: 'inline-block',
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
}));

/** CSS styles to apply to the child components. */
const panelStyles = makeStyles(theme => ({
  root: {
    borderRadius: 0,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    scrollbarColor: theme.palette.secondary.main,
    scrollbarWidth: 0,
    [theme.breakpoints.up('md')]: {
      display : props => props.width > 0 ? 'auto' : 'hidden',
      float: 'left',
      overflowX: 'auto',
      overflowY: 'auto',
      width: props => props.width,
      minWidth: props => props.width > 0 ? props.minWidth : 0
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      minWidth: '100%'
    },
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid slategrey'
    }
  }
}));


/**
 * Panel with width set based on component props.
 * 
 * @component
 * 
 * @example
 *   return (
 *     <ReactivePanel
 *       minWidth: '20%',
 *       width: '40%'
 *     >
 *       <p>The width is set by the props.</p>
 *     </ReactivePanel>
 *   );
 */
function ReactivePanel(props) {
  const { children } = props;

  /** CSS styles and global theme. */
  const classes = panelStyles(props);

  return (
    <Box
      className={classes.root}
    >
      {children}
    </Box>
  );
}


ReactivePanel.propTypes = {
  /**
   * Minimum possible width of the panel in valid CSS units.
   */
  minWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  /**
   * Current width of the panel in valid CSS units.
   */
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};


/**
 * Vertical panels that are horizontally resizable.
 * 
 * @component
 * 
 * @example
 *   return (
 *     <ReactivePanels
 *       leftMinWidth="20%"
 *       open={true}
 *       rightMinWidth="30%"
 *     >
 *       <p>This goes on the left.</p>
 *       <p>This goes on the right.</p>
 *     </ReactivePanels>
 *   );
 */
function ReactivePanels(props) {
  const { leftMinWidth, open, rightMinWidth } = props;

  /** CSS styles and global theme. */
  const classes = useStyles(props);

  /**
   * Left panel current width.
   * @type {number}
   */
  const [ leftWidth, setLeftWidth ] = useState(leftMinWidth);

  /**
   * Flag indicating resizing is occurring.
   * @type {boolean}
   */
  const [ moving, setMoving ] = useState(false);

  /**
   * Right panel current width.
   * @type {number}
   */
  const [ rightWidth, setRightWidth ] = useState(100 - leftMinWidth);
  
  /**
   * Width CSS unit to use.
   * @type {String}
   */
  const [ unit, setUnit ] = useState('%');

  // Format the widths with their CSS units to be valid CSS.
  const totalWidth = getTotalWidth();
  const leftWidthVal = open ? `${leftWidth}${unit}` : "0";
  const leftMinWidthVal = totalWidth * (leftMinWidth / 100);
  const rightWidthVal = open ? `${rightWidth - 2}${unit}` : "100%";
  const rightMinWidthVal = totalWidth * (rightMinWidth / 100);

  /**
   * Callback to start resizing the panels.
   * 
   * @param {Event} event The browser event fired by the click.
   */
  const handleClickDivider = event => {
    // Prevent the click from triggering any other parent components.
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    if (event.preventDefault) {
      event.preventDefault();
    }

    // Update the flag to indicate movement has started.
    setMoving(true);
  }

  /**
   * Callback to update panel widths on horizontal mouse movement.
   * 
   * @param {Event} event the browser event fired by mouse movement.
   */
  const handleMoveDivider = event => {
    // Only update if we are currently moving.
    if (moving) {
      // Prevent the click from triggering any other components.
      // If this is not done, the move will also start to highlight text.
      if (event.stopPropagation) {
        event.stopPropagation();
      }
      if (event.preventDefault) {
        event.preventDefault();
      }

      // Get the current mouse X position.
      const mouseX = event.pageX;

      // Compute the min and max widths for the panels as percentages.
      const rightMinWidthPercent = rightMinWidth * totalWidth / 100;
      const leftMaxWidthPercent = totalWidth - rightMinWidthPercent;
      const leftMinWidthPercent = leftMinWidth * totalWidth / 100;

      // Bound the widths based on the computed min and max widths.
      const leftWidth = Math.min(Math.max(mouseX, leftMinWidthPercent), leftMaxWidthPercent);
      const rightWidth = totalWidth - leftWidth;

      // Update the widths and CSS unit.
      setLeftWidth(leftWidth);
      setRightWidth(rightWidth);
      setUnit('px');
    }
  }

  /**
   * Callback to stop resizing the panels.
   * 
   * @param {Event} event The event fired by releasing the mouse.
   */
  const handleReleaseDivider = event => {
    // Prevent the click from triggering any other parent components.
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    if (event.preventDefault) {
      event.preventDefault();
    }

    // Update the flag to indicate resizing has stopped.
    setMoving(false);
  }

  return (
    <Box
      className={classes.root}
      component="div"
      onMouseMove={handleMoveDivider}
      onMouseUp={handleReleaseDivider}
    >
      <ReactivePanel
        minWidth={leftMinWidthVal}
        width={leftWidthVal}
      >
        <SearchParametersForm />
      </ReactivePanel>
      {open &&
        <Hidden only={['xs', 'sm']}>
          <Divider
            className={classes.divider}
            onMouseDown={handleClickDivider}
            orientation='vertical'
          />
        </Hidden>
      }
      <ReactivePanel
        minWidth={rightMinWidthVal}
        width={rightWidthVal}
      >
        <ResultsTable />
      </ReactivePanel>
    </Box>
  );
}


ReactivePanels.propTypes = {
  /**
   * Minimum width of the left panel as a percent between 0 and 100.
   */
  leftMinWidth: PropTypes.number,

  /**
   * Whether or not the left panel is open, controlled by LanguagesAppBar.
   */
  open: PropTypes.bool,
  
  /**
   * Minimum width of the right panel as a percent between 0 and 100.
   */
  rightMinWidth: PropTypes.number
}


export default ReactivePanels;
